# 새로운 React 프로젝트 세팅 가이드 (백업 복사 방식)

이 문서는 AI가 백업 템플릿을 사용하여 새로운 React 프로젝트를 빠르게 세팅하는 방법을 설명합니다.

## 사용자 요청 예시
```
{프로젝트명}으로 새로운 프로젝트 하나 세팅해줘
```

## AI가 수행해야 하는 작업 순서

### 1. 백업 템플릿 존재 확인
```bash
# _template_settings 디렉토리 존재 확인
ls -la | grep _template_settings

# 템플릿이 없는 경우, 사용자에게 안내:
# "백업 템플릿이 없습니다. 먼저 기본 프로젝트를 생성하고 백업을 만들어주세요."
```

### 2. 템플릿 복사 및 기본 설정
```bash
# 1. 백업 템플릿을 새 프로젝트명으로 복사 (OS별 명령어)
# Windows (PowerShell):
powershell -Command "Copy-Item -Path '_template_settings\template-setup' -Destination '{프로젝트명}' -Recurse"

# macOS/Linux:
cp -r _template_settings/template-setup {프로젝트명}

# 2. 프로젝트 디렉토리로 이동
cd {프로젝트명}

# 3. package.json의 프로젝트명 수정
# name 필드를 새 프로젝트명으로 변경
```

### 3. 기본 정리 작업
```bash
# 1. node_modules는 유지 (설치 시간 단축을 위해)
# - 백업 템플릿의 node_modules에는 이미 최신 MUI 패키지가 설치되어 있음
# - 복사된 node_modules를 그대로 사용하여 npm install 시간 단축

# 2. package-lock.json 유지 (정확한 버전 고정을 위해)
# - 백업 템플릿과 동일한 패키지 버전 사용

# 3. 불필요한 파일 정리
rm -rf .git  # 기존 git 히스토리 제거 (필요시)
rm -rf template-setup  # 중첩된 디렉토리 제거 (발생 시)
```

### 4. 패키지 확인 및 업데이트 (선택사항)
```bash
# 설치된 패키지 확인
npm ls

# 필요시 특정 패키지만 업데이트
npm update @mui/material @mui/icons-material

# 또는 모든 패키지 최신화 (주의: 호환성 문제 가능)
npm update
```

### 5. 개발 서버 테스트
```bash
# 개발 서버 10초 실행 테스트
timeout 10 npm run dev

# 서버 로그 확인:
# - "Local: http://localhost:xxxx/" 메시지 확인되면 성공
# - 포트 충돌 시 vite.config.js에서 다른 포트 설정

# 개발 서버 종료 처리(주의 ! : 절대 claude code는 종료하면 안됨 - 외부 네트워크에 연결된 것은 종료 x)
# - 개발 서버 확인: netstat -ano | findstr LISTENING | findstr 517
# - 개발 서버 종료: cmd //c "taskkill /PID [개발서버PID] /F"
# - 종료 확인: tasklist | findstr node.exe
```

### 6. 프로젝트 구조 확인
```bash
# 디렉토리 구조 확인
tree src/ -I node_modules

# 예상 구조:
# src/
# ├── components/
# │   ├── common/
# │   ├── ui/
# │   └── landing/
# ├── pages/
# ├── hooks/
# ├── utils/
# ├── theme.js
# ├── main.jsx
# ├── App.jsx
# └── index.css
```

## 완료 후 사용자에게 제공할 정보

1. **생성된 프로젝트 구조**
2. **설치된 패키지 목록**
3. **개발 서버 접속 URL**
4. **사용 가능한 기능들**:
   - MUI 테마 프로바이더 적용 완료
   - React Router 설치 완료
   - 기본 디렉토리 구조 생성 완료
   - CssBaseline 적용 완료

## ⚠️ 중요: 프로젝트 세팅 이후 개발 작업 규칙

**프로젝트 세팅이 완료된 후 추가적인 개발 작업을 진행할 때는 다음 규칙을 준수해야 함:**

1. **AI는 자동으로 `npm run dev`를 실행하지 않음**
   - 프로젝트 세팅 시에만 `timeout 10 npm run dev`로 서버 테스트 진행
   - 세팅 완료 후에는 사용자가 직접 개발 서버를 실행해야 함

2. **개발 서버 실행은 사용자 책임**
   - 컴포넌트 생성, 수정, 추가 기능 개발 시 AI는 코드 작성만 담당
   - 개발 서버 실행 및 테스트는 사용자가 직접 수행

3. **코드 작성 완료 후 안내**
   - AI는 코드 작성 완료 후 "개발 서버를 실행하여 확인해보세요" 형태로 안내
   - 자동으로 서버를 실행하거나 프로세스를 관리하지 않음

이 규칙을 통해 AI가 불필요한 프로세스를 실행하는 것을 방지하고, 사용자가 개발 환경을 직접 제어할 수 있도록 함.

## 주의사항 및 문제 해결

### Windows 환경에서 발생할 수 있는 문제들

1. **node_modules 복사 권한 문제**:
   - node_modules는 삭제하지 않고 유지하는 것이 원칙
   - 복사 과정에서 권한 문제가 발생할 수 있음
   - PowerShell Copy-Item 사용 시 대부분 해결됨

2. **복사 명령어 차이**:
   - Windows: PowerShell Copy-Item 사용
   - macOS/Linux: cp -r 사용

3. **중첩된 디렉토리 문제**:
   - 복사 과정에서 template-setup 디렉토리가 중첩되는 경우
   - 해당 디렉토리를 삭제하여 정리

4. **node_modules 손상 시 대처**:
   - 복사 과정에서 node_modules가 손상된 경우에만 재설치
   - `npm install` 실행하여 재설치

### 오류 발생 시 대응 방법

1. **권한 오류**: 관리자 권한으로 터미널 실행
2. **경로 오류**: 백슬래시(\) 사용 확인 (Windows)
3. **명령어 오류**: OS에 맞는 명령어 사용 확인
