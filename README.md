## 1. 이슈 작성하기

✹ **Git Issue 사용법**

- 작업할 기능에 대한 issue를 작성합니다.
- issue 제목은 **[타입] - 설명**으로 통일합니다. (ex. [Style] - 텍스트 스타일 추가)
- Assignees에는 작업을 맡은 사람을 태그합니다.
- Labels에는 해당 작업과 맞는 유형을 태그합니다.
- 설명란에는 어떤 작업을 할 예정인지, 관련된 이슈번호가 있는지 참고한 내용이 있는지 등 필요한 내용을 적습니다.
- 이렇게 issue를 생성하게 되면 #N의 이슈 번호가 생깁니다.
<br />
<br />

## 2. 브랜치 만들기

✹  **Git Branch 사용법**

- 각자 생성한 브랜치에서만 작업합니다. (브랜치 생성은 Issue 사용법 참고)
- 브랜치 이름 구조는 <**본인이름_타입/#이슈번호**> 입니다. (ex. haeun_feat/#1)
<br />
<br />

## 3. checkout 해서 브랜치 변경 (중요!! 🧠🫀🧨)

```bash
git checkout haeun_feat/#1
```
<br />
<br />

## 4. 작업

- 작업합니다
- 테스크 단위로 커밋합니다
- pull request를 통해 본인이 작업한 branch를 develop branch에 merge합니다.
- 코드 리뷰한 후 머지하기 (1명 혹은 2명, 개발 팀장을 정해도 좋아요.)

✹  Commit 메시지 작성법

```bash
타입 : 짧은 내용(한글로)
feat : 로그인
ex)style : 텍스트 디자인시스템 구축
```

|  |  |  |
| --- | --- | --- |
| type | Description | Example |
| feat | 새로운 기능 추가, 구현 | feat : 로그인 기능 구현 |
| edit | 단순 오타 수정 | edit : 로그인 캐시 처리 방식 수정 |
| style | UI작업, 스타일 관련 파일 추가 및 수정 | style : 폰트 등록 |
| add | asset 파일(이미지, 아이콘 등) 추가 | add : 위젯 이미지 추가 |
| chore | 파일, 경로를 옮기거나 이름 변경 | chore : feet -> feat 이름 변경 |
| delete | 덤프 파일 삭제 | delete : Empty.md 파일 삭제 |
| merge | 브랜치 병합(merge) | merge : pull request #3 from LikeLionHGU/Haeun_Style/#1 |
| fix | 버그 픽스 | fix : Color 버그 수정 |
| docs | 문서 작업 | docs : Readme 작성 |
| refactor | 코드 리팩토링 | refactor : 변수명 수정 |
| model | 데이터베이스(모델) 작업 | model : 데이터 모델 생성 |
| init | 프로젝트 생성 | init : 프로젝트 생성 |
| test | 테스트 케이스 생성 | test: 테스트 케이스 생성 |
| 빌드관련 |  |  |  
| build | 재빌드 | build: 동일버전 재빌드(x.xx) |
| version | 버전 업 | version : 버전(2.0.0) 업데이트 |



✹  Pull Request 제목 작성법

이름_타입/#이슈번호 → 풀 시킬 브랜치 (ex. Hani_Style/#1 -> dev)
