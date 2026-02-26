# Task 4: AI 뇌(Python) - "습관 기억(Habit Memory)" 엔진 탑재

## 📌 목표

단순히 "밥 줘"하면 "안녕"하고 말하는 시시한 챗봇이 아닙니다. 파이썬 서버에서는 넘겨받은 다마고치의 컨디션과, 그에 엮인 "유저의 로그"를 바탕으로 성격을 변화시키는 프롬프트 깎기(Prompt Engineering) 장인이 되어야 합니다.

## 세부 업무 내용 (AI & Python Developer)

### 1. FastAPI 셋팅 및 OpenAI 통신 (`main.py`)

이 코드를 그대로 가져가서 실행(`uvicorn main:app --reload`)하면 뼈대는 100% 완성입니다.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

app = FastAPI()

# 프론트, Node서버에서 들어오게 허락
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI 키 넣기 (본인 발급 키로 변경, 코드엔 숨기세요!)
openai.api_key = "sk-xxxxxxxx"

# 데이터 그릇 (Node.js에서 보내는 JSON)
class ChatRequest(BaseModel):
    user_text: str
    hunger: int
    happiness: int
    memories: str   # Node서버가 만들어준 유저의 습관 문장

@app.post("/api/ai/chat")
async def ai_chat(req: ChatRequest):
    # 1. AI에게 최면 걸기 (System Prompt)
    system_prompt = f"""
    당신의 이름은 '로비'. 조금 거칠지만 은근 주인을 챙기는 츤데레 다마고치입니다.
    현재 당신의 상태는 다음과 같습니다:
    배고픔: {req.hunger}점 (100점 만점) - 너무 낮으면 짜증내세요.
    친밀도: {req.happiness}점 (100점 만점) - 높으면 따뜻하게 대하세요.

    [가장 중요한, 주인의 행동 패턴 기억]:
    {req.memories}

    위 기억을 이용해서 다마고치처럼 1~2문장의 짧고 친밀한 말투(반말)로 대답하세요.
    예를 들어 주인이 밤 11시에만 놀아주는 편식러라면 그걸 비꼬아서 "너 맨날 이 시간에만 밥 주더라?" 같은 식으로 활용하세요.
    """

    # 2. GPT에게 보낸다!
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", # 가성비 모델
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.user_text}
        ],
        temperature=0.8 # 창의성 (0.0 이면 기계, 1.0 이면 미친 챗봇)
    )

    # 3. GPT 응답 추출해서 JSON 리턴
    answer = response.choices[0].message['content']
    return {"reply": answer}
```

## 🏆 PM 확인 체크

- [ ] 파이썬 개발팀은 본인의 로컬에서 Postman 앱으로 `http://localhost:8000/api/ai/chat` 주소에 JSON 바디를 쏘아 `reply` 값이 오는지 테스트 성공했는가?
- [ ] 프롬프트에 `memories`가 입력될 때 AI가 해당 기억(시간/습관)을 문장에 잘 버무려서 똑똑하게 리턴하는지 확인했는가?
