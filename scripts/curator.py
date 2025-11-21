#!/usr/bin/env python3
"""
AI Tech Curator - Script para obtener y procesar noticias de HackerNews
Usa OpenAI API para generar resúmenes con personalidad técnica y cínica
"""

import os
import json
import requests
from openai import OpenAI
from pathlib import Path

# Configuración
HN_API_BASE = "https://hacker-news.firebaseio.com/v0"
TOP_STORIES_COUNT = 5
OUTPUT_DIR = Path(__file__).parent.parent / "data"
OUTPUT_FILE = OUTPUT_DIR / "ai-news.json"

# Asegurar que el directorio existe
OUTPUT_DIR.mkdir(exist_ok=True)

def get_top_stories(count=5):
    """Obtiene los IDs de las top stories de HackerNews"""
    try:
        response = requests.get(f"{HN_API_BASE}/topstories.json", timeout=10)
        response.raise_for_status()
        top_ids = response.json()[:count]
        return top_ids
    except Exception as e:
        print(f"Error obteniendo top stories: {e}")
        return []

def get_story_details(story_id):
    """Obtiene los detalles de una historia específica"""
    try:
        response = requests.get(f"{HN_API_BASE}/item/{story_id}.json", timeout=10)
        response.raise_for_status()
        story = response.json()
        return {
            "title": story.get("title", ""),
            "url": story.get("url", f"https://news.ycombinator.com/item?id={story_id}"),
            "id": story_id
        }
    except Exception as e:
        print(f"Error obteniendo detalles de historia {story_id}: {e}")
        return None

def process_with_openai(stories):
    """Procesa las historias con OpenAI para generar resúmenes"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY no está configurada en las variables de entorno")
    
    client = OpenAI(api_key=api_key)
    
    # Preparar el prompt con las noticias
    stories_text = "\n".join([
        f"{i+1}. {story['title']} - {story['url']}"
        for i, story in enumerate(stories)
    ])
    
    system_prompt = (
        "Eres un Ingeniero de Software Senior cínico y experto. "
        "Resume estas 5 noticias en 1 frase corta e impactante cada una, "
        "con un tono técnico pero sarcástico. "
        "Devuélvelo en formato JSON puro con esta estructura exacta: "
        '[{"title": "...", "summary": "...", "link": "..."}, ...]'
    )
    
    user_prompt = f"Noticias de HackerNews:\n{stories_text}"
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Modelo más económico
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.8,
            max_tokens=500
        )
        
        content = response.choices[0].message.content.strip()
        
        # Limpiar el contenido si viene con markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        # Parsear JSON
        summaries = json.loads(content)
        
        # Asegurar que tenemos el formato correcto
        result = []
        for i, story in enumerate(stories):
            if i < len(summaries):
                result.append({
                    "title": summaries[i].get("title", story["title"]),
                    "summary": summaries[i].get("summary", ""),
                    "link": summaries[i].get("link", story["url"])
                })
            else:
                result.append({
                    "title": story["title"],
                    "summary": "Resumen no disponible",
                    "link": story["url"]
                })
        
        return result
        
    except json.JSONDecodeError as e:
        print(f"Error parseando JSON de OpenAI: {e}")
        print(f"Contenido recibido: {content}")
        # Fallback: devolver las historias sin resumen
        return [
            {
                "title": story["title"],
                "summary": "Error procesando con IA",
                "link": story["url"]
            }
            for story in stories
        ]
    except Exception as e:
        print(f"Error procesando con OpenAI: {e}")
        # Fallback: devolver las historias sin resumen
        return [
            {
                "title": story["title"],
                "summary": "Error procesando con IA",
                "link": story["url"]
            }
            for story in stories
        ]

def main():
    """Función principal"""
    print("🤖 AI Tech Curator iniciando...")
    
    # Obtener top stories
    print("📰 Obteniendo top stories de HackerNews...")
    top_ids = get_top_stories(TOP_STORIES_COUNT)
    
    if not top_ids:
        print("❌ No se pudieron obtener las top stories")
        return
    
    # Obtener detalles de cada historia
    print(f"📖 Obteniendo detalles de {len(top_ids)} historias...")
    stories = []
    for story_id in top_ids:
        story = get_story_details(story_id)
        if story:
            stories.append(story)
    
    if not stories:
        print("❌ No se pudieron obtener detalles de las historias")
        return
    
    # Procesar con OpenAI
    print("🧠 Procesando con OpenAI...")
    try:
        processed_stories = process_with_openai(stories)
    except Exception as e:
        print(f"❌ Error procesando con OpenAI: {e}")
        # Fallback: guardar historias sin resumen
        processed_stories = [
            {
                "title": story["title"],
                "summary": "Resumen no disponible",
                "link": story["url"]
            }
            for story in stories
        ]
    
    # Guardar resultado
    print(f"💾 Guardando en {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(processed_stories, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Proceso completado. {len(processed_stories)} noticias guardadas.")
    print(f"📄 Archivo: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

