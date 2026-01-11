# disk-cms 디자인 고도화 작업 요청

안녕하세요! disk-cms 프로젝트의 디자인 고도화 작업을 요청드립니다.

## 📋 프로젝트 개요

**프로젝트명**: disk-cms (보험대리점 통합 CMS)  
**작업 목적**: React로 마이그레이션을 위한 디자인 시스템 구축 및 화면 디자인  
**현재 상태**: Vanilla JS + AdminLTE 3.2.0 기반 운영 중  
**향후 계획**: React 18.3+ + Vite + TypeScript로 점진적 마이그레이션

## 🎯 작업 범위

### Phase 1: 디자인 시스템 (최우선)
- 디자인 토큰 정의 (Colors, Typography, Spacing, Shadows)
- Atoms 컴포넌트 (Button, Input, Badge, Icon 등)
- Molecules 컴포넌트 (FormField, SearchBar, Card 등)

### Phase 2: 레이아웃 컴포넌트
- Header 컴포넌트
- Sidebar 컴포넌트  
- Layout Templates (Dashboard, Auth, FullWidth)

### Phase 3: 핵심 화면
- ⭐ 로그인 화면 (가장 먼저 작업)
- 대시보드
- 티켓 시스템 (목록/상세/폼)

### Phase 4~7: 주요 기능 화면 및 최적화
(상세 내용은 전체 지시서 참조)

## ⚠️ 중요 사항

1. **React 컴포넌트화 고려**
   - 모든 UI 요소를 재사용 가능한 컴포넌트로 설계
   - Figma Component Properties = React Props가 되도록
   - Variants로 모든 상태 표현

2. **디자인 토큰 명확히 정의**
   - Colors, Typography, Spacing을 Styles/Variables로 관리
   - 개발자 핸드오프 시 JSON 형식으로 내보내기 가능하도록

3. **상태 관리**
   - 모든 컴포넌트의 상태 디자인 (default, hover, active, disabled, loading, error)
   - 로딩, 에러, 빈 상태 등 모든 케이스 고려

4. **반응형 디자인**
   - Mobile (320px~767px)
   - Tablet (768px~1023px)  
   - Desktop (1024px+)
   - 각 브레이크포인트별 프레임 생성

## 📄 상세 지시서

전체 상세 지시서는 다음 파일을 참조해주세요:
- 파일명: `memo` (같은 폴더에 위치)
- 내용: 디자인 시스템, 컴포넌트 스펙, 화면별 요구사항, React 마이그레이션 고려사항 등

## 💬 작업 진행 방식

1. **Phase 1 완료 후 리뷰**: 디자인 시스템 구축 완료 시 공유 및 피드백
2. **Phase 3 핵심 화면 완료 후 리뷰**: 로그인, 대시보드, 티켓 시스템 디자인 완료 시
3. **주기적 소통**: 작업 중 질문이나 확인이 필요한 사항은 언제든 공유해주세요

## 📌 작업 시작 전 확인사항

- [ ] 전체 지시서(`memo` 파일) 검토 완료
- [ ] 디자인 시스템 구조 이해 완료
- [ ] React 마이그레이션 계획 이해 완료
- [ ] 작업 우선순위 확인 완료
- [ ] 질문사항 정리 완료 (필요시)

---

**작업 시작**: Phase 1 (디자인 시스템 구축)부터 시작해주세요.  
**질문**: 작업 중 질문이나 확인이 필요한 사항은 언제든 공유해주세요!

감사합니다.
