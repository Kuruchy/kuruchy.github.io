#!/usr/bin/env python3
"""
AI Tech Curator - Obtiene noticias de HackerNews y las resume con OpenAI
"""

import os
import json
import re
import time
import traceback
import requests
from pathlib import Path
from openai import OpenAI, RateLimitError, APIError

# Configuración
HN_API_BASE = "https://hacker-news.firebaseio.com/v0"
TOP_STORIES_COUNT = 5
OUTPUT_DIR = Path(__file__).parent.parent / "data"
OUTPUT_FILE = OUTPUT_DIR / "ai-news.json"
OUTPUT_DIR.mkdir(exist_ok=True)


def get_top_stories(count=5):
    """Obtiene los IDs de las top stories de HackerNews"""
    try:
        response = requests.get(f"{HN_API_BASE}/topstories.json", timeout=10)
        response.raise_for_status()
        return response.json()[:count]
    except Exception as e:
        print(f"❌ Error obteniendo top stories: {e}")
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
        print(f"❌ Error obteniendo detalles de historia {story_id}: {e}")
        return None


def parse_openai_response(content):
    """Parsea la respuesta de OpenAI y extrae el JSON"""
    # Limpiar markdown code blocks
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    # Intentar parsear directamente
    try:
        parsed = json.loads(content)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict):
            # Buscar array en el objeto
            for key in parsed:
                if isinstance(parsed[key], list):
                    return parsed[key]
    except json.JSONDecodeError:
        pass
    
    # Intentar extraer JSON con regex
    json_match = re.search(r'\[.*\]', content, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
    
    raise ValueError("No se pudo encontrar JSON válido en la respuesta")


def process_with_openai(stories, max_retries=5, initial_delay=1):
    """Procesa las historias con OpenAI para generar resúmenes con retry logic"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY no está configurada")
    
    client = OpenAI(api_key=api_key, max_retries=0)
    
    stories_text = "\n".join([
        f"{i+1}. {story['title']} - {story['url']}"
        for i, story in enumerate(stories)
    ])
    
    system_prompt = (
        "Eres un Ingeniero de Software Senior cínico y experto. "
        "Analiza estas noticias de HackerNews y crea resúmenes con 3-5 keypoints técnicos y relevantes cada uno, "
        "con un tono técnico pero sarcástico. "
        "Cada resumen debe ser conciso pero informativo, destacando los aspectos más importantes. "
        "Devuélvelo SOLO en formato JSON válido, sin markdown, sin explicaciones. "
        "Estructura: [{\"title\": \"título original\", \"summary\": \"resumen con 3-5 keypoints\", \"link\": \"url\"}, ...]"
    )
    
    user_prompt = f"Noticias de HackerNews:\n{stories_text}\n\nDevuelve SOLO el array JSON:"
    
    delay = initial_delay
    time.sleep(0.5)  # Delay inicial para evitar rate limits
    
    for attempt in range(max_retries):
        try:
            if attempt > 0:
                print(f"⏳ Esperando {delay}s antes de reintentar ({attempt + 1}/{max_retries})...")
                time.sleep(delay)
                delay = min(delay * 2, 60)
            
            print(f"🔄 Procesando con OpenAI ({attempt + 1}/{max_retries})...")
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.8,
                max_tokens=1500,  # Aumentado para resúmenes más largos
                timeout=30.0
            )
            
            content = response.choices[0].message.content.strip()
            summaries = parse_openai_response(content)
            
            # Construir resultado
            result = []
            for i, story in enumerate(stories):
                if i < len(summaries) and isinstance(summaries[i], dict):
                    summary_data = summaries[i]
                    result.append({
                        "title": summary_data.get("title", story["title"]),
                        "summary": summary_data.get("summary", "Resumen no disponible"),
                        "link": summary_data.get("link", story["url"])
                    })
                else:
                    result.append({
                        "title": story["title"],
                        "summary": "Resumen no disponible",
                        "link": story["url"]
                    })
            
            return result
            
        except RateLimitError as e:
            error_message = str(e)
            print(f"⚠️  Rate limit ({attempt + 1}/{max_retries}): {error_message}")
            
            if "retry after" in error_message.lower():
                try:
                    retry_after = int(re.search(r'retry after (\d+)', error_message.lower()).group(1))
                    delay = retry_after + 1
                    print(f"⏳ Esperando {delay}s según el error...")
                except:
                    pass
            
            if attempt == max_retries - 1:
                raise
            
        except APIError as e:
            error_message = str(e)
            error_code = getattr(e, 'status_code', None)
            
            if error_code == 429 or "429" in error_message or "rate limit" in error_message.lower():
                print(f"⚠️  Error 429 ({attempt + 1}/{max_retries}): {error_message}")
                if attempt == max_retries - 1:
                    raise
            else:
                print(f"❌ Error de API: {error_message}")
                raise
                
        except (json.JSONDecodeError, ValueError) as e:
            print(f"❌ Error parseando JSON: {e}")
            print(f"Contenido: {content[:500]}")
            traceback.print_exc()
            raise
            
        except Exception as e:
            print(f"⚠️  Error inesperado ({attempt + 1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                traceback.print_exc()
                raise
    
    raise Exception("Error desconocido en process_with_openai")


def main():
    """Función principal"""
    print("🤖 AI Tech Curator iniciando...")
    
    print("📰 Obteniendo top stories...")
    top_ids = get_top_stories(TOP_STORIES_COUNT)
    if not top_ids:
        print("❌ No se pudieron obtener las top stories")
        return
    
    print(f"📖 Obteniendo detalles de {len(top_ids)} historias...")
    stories = []
    for story_id in top_ids:
        story = get_story_details(story_id)
        if story:
            stories.append(story)
    
    if not stories:
        print("❌ No se pudieron obtener detalles")
        return
    
    print("🧠 Procesando con OpenAI...")
    try:
        processed_stories = process_with_openai(stories)
        print(f"✅ {len(processed_stories)} noticias procesadas")
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()
        processed_stories = [
            {
                "title": story["title"],
                "summary": f"Error: {str(e)[:50]}",
                "link": story["url"]
            }
            for story in stories
        ]
    
    print(f"💾 Guardando en {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(processed_stories, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Completado. {len(processed_stories)} noticias guardadas.")


if __name__ == "__main__":
    main()
