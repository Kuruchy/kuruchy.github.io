#!/usr/bin/env python3
"""
Daily Poker Puzzle Generator - Genera situaciones estratégicas de poker con IA
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
from openai import OpenAI, RateLimitError, APIError
import time
import traceback

# Configuración
OUTPUT_DIR = Path(__file__).parent.parent / "data"
OUTPUT_FILE = OUTPUT_DIR / "daily_poker.json"
OUTPUT_DIR.mkdir(exist_ok=True)


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
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass
    
    # Intentar extraer JSON con regex
    json_match = re.search(r'\{.*\}', content, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
    
    raise ValueError("No se pudo encontrar JSON válido en la respuesta")


def generate_poker_hand(max_retries=5, initial_delay=1):
    """Genera una situación de poker usando OpenAI"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY no está configurada")
    
    client = OpenAI(api_key=api_key, max_retries=0)
    
    # Obtener fecha actual para el ID
    today = datetime.utcnow().strftime("%Y-%m-%d")
    puzzle_id = f"poker-{today}"
    
    system_prompt = (
        "Eres un coach de poker de High Stakes especializado en Texas Hold'em No-Limit 6-Max. "
        "Genera un escenario estratégico interesante y educativo. "
        "El escenario debe ser realista y presentar una decisión compleja que requiera análisis GTO. "
        "Puede ser en cualquier calle (Preflop, Flop, Turn, o River). "
        "Incluye información sobre posición, stack sizes, acción previa, y el contexto de la mesa. "
        "La solución debe explicar la línea GTO con razonamiento claro sobre equity, pot odds, y rangos."
    )
    
    user_prompt = (
        f"Genera un puzzle de poker para el día {today}. "
        "Devuelve SOLO un objeto JSON válido con la siguiente estructura exacta:\n"
        "{\n"
        '  "id": "poker-YYYY-MM-DD",\n'
        '  "title": "Título descriptivo del escenario (ej: Hero in BB facing River Jam)",\n'
        '  "hero_cards": ["Ah", "Ks"],\n'
        '  "board": ["Kd", "Tc", "2s", "8h", "Qc"],  // Puede tener 0, 3, 4 o 5 cartas\n'
        '  "pot_size": "120bb",\n'
        '  "villain_action": "All-in for 80bb",\n'
        '  "history": "BTN opens 2.5bb, Hero 3-bets to 8bb from BB, BTN calls. Flop: Kd Tc 2s. Hero bets 12bb, BTN calls. Turn: 8h. Hero checks, BTN bets 30bb...",\n'
        '  "solution": "Call. GTO sugiere hacer call porque Hero tiene suficiente equity (45%) contra el rango de all-in del Villain. El pot odds son 200bb:80bb (2.5:1), lo que requiere solo 28.5% de equity para ser rentable. Además, Hero bloquea algunos bluffs del Villain con el Ks..."\n'
        "}\n\n"
        "IMPORTANTE: Usa formato de cartas estándar (As, Kh, Qd, Jc, etc.) donde la segunda letra es el palo: h=hearts, d=diamonds, s=spades, c=clubs. "
        "El board debe ser un array con 0, 3, 4 o 5 cartas según la calle. "
        "La solución debe ser detallada y educativa."
    )
    
    delay = initial_delay
    time.sleep(0.5)  # Delay inicial para evitar rate limits
    
    for attempt in range(max_retries):
        try:
            if attempt > 0:
                print(f"⏳ Esperando {delay}s antes de reintentar ({attempt + 1}/{max_retries})...")
                time.sleep(delay)
                delay = min(delay * 2, 60)
            
            print(f"🔄 Generando puzzle de poker con OpenAI ({attempt + 1}/{max_retries})...")
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.8,
                max_tokens=1500,
                timeout=30.0
            )
            
            content = response.choices[0].message.content.strip()
            puzzle_data = parse_openai_response(content)
            
            # Validar y completar estructura
            if not isinstance(puzzle_data, dict):
                raise ValueError("La respuesta no es un objeto JSON válido")
            
            # Asegurar que el ID sea correcto
            puzzle_data["id"] = puzzle_id
            
            # Validar campos requeridos
            required_fields = ["title", "hero_cards", "board", "pot_size", "villain_action", "history", "solution"]
            for field in required_fields:
                if field not in puzzle_data:
                    raise ValueError(f"Campo requerido faltante: {field}")
            
            # Validar formato de cartas
            if not isinstance(puzzle_data["hero_cards"], list) or len(puzzle_data["hero_cards"]) != 2:
                raise ValueError("hero_cards debe ser un array con exactamente 2 cartas")
            
            if not isinstance(puzzle_data["board"], list) or len(puzzle_data["board"]) not in [0, 3, 4, 5]:
                raise ValueError("board debe ser un array con 0, 3, 4 o 5 cartas")
            
            return puzzle_data
            
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
            if attempt == max_retries - 1:
                raise
            
        except Exception as e:
            print(f"⚠️  Error inesperado ({attempt + 1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                traceback.print_exc()
                raise
    
    raise Exception("Error desconocido en generate_poker_hand")


def main():
    """Función principal"""
    print("🎴 Daily Poker Puzzle Generator iniciando...")
    
    try:
        puzzle = generate_poker_hand()
        print(f"✅ Puzzle generado: {puzzle['title']}")
        
        print(f"💾 Guardando en {OUTPUT_FILE}...")
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(puzzle, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Completado. Puzzle guardado con ID: {puzzle['id']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()
        raise


if __name__ == "__main__":
    main()

