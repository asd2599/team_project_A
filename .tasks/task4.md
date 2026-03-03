# Task 4: 핵심 스탯 데이터베이스화 & 진화(상태) 트랜지션 로직

## 📌 목표 (Goal)

프롬프트가 추출한 세부 수정치(`delta_empathy`, `delta_logic` 등)를 클라이언트의 다마고치 `DB status` 에 반영하고, 이를 기반으로 상태 변경(Evolution, Mood Shift)을 일으키는 게임 시스템을 구현합니다.

## 📝 세부 업무 내용 (Detailed Workflow)

### 4-1. 능력치 적립 및 배분 공식 (Server-Side Calculation)

- **점수 정규화 로직**:
  - `UPDATE damagotchis SET empathy_exp = empathy_exp + $1 WHERE id = $2` 방식으로 누적.
  - 경험치(exp)가 100을 초과할 경우 -> `초과된 경험치 = 현재 경험치 % 100`으로 롤아웃 시키고 `level = level + 1` 수행 (트랜잭션 단위로 안전하게 묶음).
  - 하루 단위로 `hunger` (배고픔)가 자동 감소되는 스케줄러(Scheduler) 배치 필요. (Crontab 또는 APScheduler 활용, 1시간에 hunger -2씩 감소)

### 4-2. 다마고치의 분기점 (Evolution Branch) 알고리즘

- 레벨(Level) 단위가 5, 10 등에 도달할 때, 그 순간의 `empathy`, `logic`, `charm` 의 누적 수치 중 "가장 높은 수치(Dominant Stat)"에 따라 폼(Form)이 변경되는 알고리즘.
  ```python
  # 파이썬 예시 로직
  if new_level == 5:
      stats = {"공감형": empathy_exp, "논리형": logic_exp, "매력형": charm_exp}
      dominant = max(stats, key=stats.get)
      if dominant == "공감형":
          new_status = "ANGEL_FORM"
      elif dominant == "논리형":
          new_status = "DOCTOR_FORM"
  ```
- 변경된 `status` 코드를 프론트엔드로 즉시 전송.

### 4-3. 애니메이션 및 동적 렌더링 (React Frontend)

- 서버에서 던져준 `state.status`를 기준으로 화면에 띄울 캐릭터 컴포넌트를 분기 처리 (Switch문).
- **상태 전이 효과 (Transition Effect)**:
  - 레벨업 시 화면 전체가 빛나는 CSS 렌즈 플레어 이펙트 혹은 파티클 제너레이터(예: `react-tsparticles` 등) 작동.
  - 다마고치의 기본 Idle(대기) 애니메이션은 CSS Keyframes의 스프라이트 시트 분할 기법이나 라이브러리(Framer Motion 등)를 활용하여 상하로 둥실둥실 떠다니는(Float) 효과 필수 적용.
- 프론트엔드는 주기적으로 백엔드에 Polling 하거나, 로컬 스토리지 등에 `현재 경험치 게이지 바`의 Width(퍼센트)를 실시간 반영하여 `width: {{exp}}%` CSS 트랜지션을 작동시킴.
