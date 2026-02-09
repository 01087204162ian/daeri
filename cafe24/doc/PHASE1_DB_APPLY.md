# Phase 1: DB · 스키마 적용

**대상**: Cafe24 MariaDB 10.6 (DB: mr4989, 사용자: mr4989)  
**스키마 파일**: `../schema-mariadb-10.6.sql` (MariaDB 10.6 호환, UUID는 INSERT 시 또는 PHP에서 생성)

---

## 1. 사전 확인

- DB `mr4989` 사용 예정(이미 있음). 별도 DB를 쓰려면 Cafe24에서 생성 후 아래에서 DB명만 바꾸면 됨.
- 스키마를 **처음** 적용하는지, **이미 테이블이 있어서** 초기 데이터만 넣는지 확인.

---

## 2. 스키마 파일 업로드

1. 로컬에서 `daeri/cafe24/schema-mariadb-10.6.sql` 파일을 서버로 업로드.
   - 예: FTP/SFTP로 `~/www/` 또는 `~/` 등 본인 계정 경로에 저장.
2. 서버에서 위치 확인:
   ```bash
   cd ~
   ls -la schema-mariadb-10.6.sql
   ```

---

## 3. DB에 적용

**방법 A: mysql 클라이언트로 한 번에 실행**

```bash
mysql -u mr4989 -p mr4989 < schema-mariadb-10.6.sql
```

비밀번호 입력 후 끝날 때까지 대기.

**방법 B: mysql 접속 후 source로 실행**

```bash
mysql -u mr4989 -p mr4989
```

접속 후:

```sql
source /경로/schema-mariadb-10.6.sql
-- 예: source /home/mr4989/schema-mariadb-10.6.sql
exit
```

---

## 4. 적용 결과 확인

```bash
mysql -u mr4989 -p mr4989 -e "
  SHOW TABLES;
  SELECT COUNT(*) AS partners FROM partners;
  SELECT COUNT(*) AS premium_rates FROM premium_rates;
"
```

- `partners`: 1행  
- `premium_rates`: 18행  
이면 정상 적용된 것입니다.

---

## 5. 문제 발생 시

- **이미 테이블이 있는 경우**  
  `CREATE TABLE IF NOT EXISTS` 이라 테이블은 그대로 두고, `partners` / `premium_rates` INSERT만 중복 시 ON DUPLICATE KEY로 갱신됩니다. 기존 데이터가 있다면 필요 시 스크립트에서 해당 INSERT 블록만 주석 처리 후 다시 실행할 수 있습니다.

- **오류 메시지가 나오면**  
  메시지 전체를 복사해 두고, 어떤 명령(또는 몇 번째 줄 근처)에서 났는지 확인하면 좋습니다.  
  - `access denied`: 사용자/비밀번호/DB 권한 확인  
  - `unknown database`: DB명(mr4989) 및 접속 옵션 확인  
  - `Duplicate entry`: 이미 데이터가 있어서 나는 경우일 수 있음(위 확인 절로 점검)

---

## 6. 적용 후

- 스키마 적용이 끝나면 **서버 설정 파일**을 만듭니다. → [SERVER_CONFIG.md](SERVER_CONFIG.md) (DB 접속·알리고 등 config.php)
- 그 다음 **Phase 2**(PHP API·페이지 구현)로 진행하면 됩니다.
- `schema-mariadb-10.6.sql` 은 보안상 웹에서 직접 접근되지 않는 경로에 두고, 필요 시 삭제하거나 백업용으로만 보관해도 됩니다.

**작성일**: 2026-02-09
