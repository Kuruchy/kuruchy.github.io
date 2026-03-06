#!/usr/bin/env python3
"""
AI Tech Curator - Obtiene noticias de HackerNews
"""

import json
import requests
from pathlib import Path

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
            "link": story.get("url", f"https://news.ycombinator.com/item?id={story_id}"),
            "hn_link": f"https://news.ycombinator.com/item?id={story_id}",
            "score": story.get("score", 0),
            "comments": story.get("descendants", 0)
        }
    except Exception as e:
        print(f"❌ Error obteniendo detalles de historia {story_id}: {e}")
        return None


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

    print(f"💾 Guardando en {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(stories, f, ensure_ascii=False, indent=2)

    print(f"✅ Completado. {len(stories)} noticias guardadas.")


if __name__ == "__main__":
    main()
