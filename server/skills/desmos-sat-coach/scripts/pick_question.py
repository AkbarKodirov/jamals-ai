#!/usr/bin/env python3
"""Pick a random question from the Desmos SAT Coach bank.

Usage:
  python3 scripts/pick_question.py                       # random question, answer hidden
  python3 scripts/pick_question.py --domain circles      # filter by domain or skill text
  python3 scripts/pick_question.py --difficulty "very hard"
  python3 scripts/pick_question.py --exclude ALG-01,ADV-03
  python3 scripts/pick_question.py --reveal ADV-13       # full entry with hints and solution
  python3 scripts/pick_question.py --list                # index of all questions
"""
import argparse, json, os, random, sys

BANK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "references", "question-bank.json")


def load():
    with open(BANK, encoding="utf-8") as f:
        return json.load(f)


def show_question(q):
    print(f"[{q['id']}] {q['domain']} | {q['difficulty']}")
    print(q["question"])
    for letter, text in (q.get("choices") or {}).items():
        print(f"  {letter}) {text}")


def show_full(q):
    show_question(q)
    print(f"\nAnswer: {q['answer']}")
    for i, hint in enumerate(q["hints"], 1):
        print(f"Hint {i}: {hint}")
    print("Desmos:")
    for i, step in enumerate(q["desmos"], 1):
        print(f"  {i}. {step}")
    print(f"Look for: {q['look_for']}")
    print(f"Why: {q['why']}")
    print(f"Trap: {q['trap']}")
    print(f"Next time: {q['rule']}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--domain", help="text matched against domain and skill, case-insensitive")
    ap.add_argument("--difficulty", help="hard or very hard")
    ap.add_argument("--exclude", default="", help="comma-separated IDs already served")
    ap.add_argument("--reveal", help="print the full entry for this ID")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()
    bank = load()

    if args.list:
        for q in bank:
            print(f"{q['id']:7} {q['difficulty']:9} {q['domain']} - {q['skill']}")
        return
    if args.reveal:
        match = [q for q in bank if q["id"].lower() == args.reveal.lower()]
        if not match:
            sys.exit(f"No question with ID {args.reveal}")
        show_full(match[0])
        return

    excluded = {e.strip().upper() for e in args.exclude.split(",") if e.strip()}
    pool = [q for q in bank if q["id"].upper() not in excluded]
    if args.domain:
        needle = args.domain.lower().rstrip("s") or args.domain.lower()
        pool = [q for q in pool if needle in q["domain"].lower() or needle in q["skill"].lower()]
    if args.difficulty:
        pool = [q for q in pool if q["difficulty"].lower() == args.difficulty.lower()]
    if not pool:
        sys.exit("No questions left for that filter. Drop a filter or clear --exclude.")
    show_question(random.SystemRandom().choice(pool))


if __name__ == "__main__":
    main()
