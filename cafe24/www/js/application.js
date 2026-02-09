/**
 * 가입신청 폼
 */

let isCalculatingPremium = false;

function renderApplicationForm() {
    const container = document.getElementById('application-form-container');
    if (!container) return;

    container.innerHTML = `
        <div class="application-grid">
            <!-- Left - Application Process Steps -->
            <div class="application-steps-card">
                <h3 class="application-steps-title">가입 절차 안내</h3>
                
                <div class="application-accordion">
                    <!-- Step 1-1 - 가입신청 (대리기사와 계약자가 같을 경우) -->
                    <div class="application-accordion-item">
                        <button class="application-accordion-trigger" type="button" data-target="step-1-1">
                            <div class="application-step-header">
                                <div class="application-step-number">1</div>
                                <span class="application-step-label">가입신청 (대리기사 = 계약자)</span>
                                <svg class="application-accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div class="application-accordion-content" id="step-1-1">
                            <ul class="application-step-list">
                                <li>대리 운전자 성명, 주민번호, 우편물 받을 주소, 핸드폰번호</li>
                                <li>대리 운전자 은행계좌번호 및 은행명</li>
                                <li>카드 계약 시: 운전자 카드번호와 유효기간</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Step 1-2 - 가입신청 (대리기사와 계약자가 다를 경우) -->
                    <div class="application-accordion-item">
                        <button class="application-accordion-trigger" type="button" data-target="step-1-2">
                            <div class="application-step-header">
                                <div class="application-step-number">1</div>
                                <span class="application-step-label">가입신청 (대리기사 ≠ 계약자)</span>
                                <svg class="application-accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div class="application-accordion-content" id="step-1-2">
                            <ul class="application-step-list">
                                <li>대리 운전자 성명, 주민번호, 우편물 받을 주소, 핸드폰번호</li>
                                <li>계약자 은행계좌번호 및 은행명</li>
                                <li>카드 계약 시: 계약자 카드번호와 유효기간</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Step 2 - DB손해보험 심사 -->
                    <div class="application-accordion-item">
                        <button class="application-accordion-trigger" type="button" data-target="step-2">
                            <div class="application-step-header">
                                <div class="application-step-number">2</div>
                                <span class="application-step-label">DB손해보험 심사</span>
                                <svg class="application-accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div class="application-accordion-content" id="step-2">
                            <ul class="application-step-list">
                                <li>근무시간(09:00~17:00) 이내 신청건은 <span class="application-step-highlight">당일 처리</span></li>
                                <li>그 외 시간은 익영업일에 처리됩니다</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Step 3 - 보험료 납입 -->
                    <div class="application-accordion-item">
                        <button class="application-accordion-trigger" type="button" data-target="step-3">
                            <div class="application-step-header">
                                <div class="application-step-number">3</div>
                                <span class="application-step-label">보험료 납입</span>
                                <svg class="application-accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div class="application-accordion-content" id="step-3">
                            <div class="application-step-payment">
                                <span>1회차: <span class="application-step-highlight">25%</span></span>
                                <span>2~7회: <span class="application-step-highlight">10%</span></span>
                                <span>8~10회: <span class="application-step-highlight">5%</span></span>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4 - 문자안내 -->
                    <div class="application-accordion-item">
                        <button class="application-accordion-trigger" type="button" data-target="step-4">
                            <div class="application-step-header">
                                <div class="application-step-number">4</div>
                                <span class="application-step-label">문자안내</span>
                                <svg class="application-accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div class="application-accordion-content" id="step-4">
                            <ul class="application-step-list">
                                <li>보험계약 완료 시 운전자님 핸드폰으로 증권번호 발송</li>
                                <li>담당자 핸드폰으로도 증권번호 발송</li>
                            </ul>
                        </div>
                    </div>

                    <!-- 해지방법 -->
                    <div class="application-accordion-item application-accordion-item-cancel">
                        <button class="application-accordion-trigger" type="button" data-target="step-cancel">
                            <div class="application-step-header">
                                <div class="application-step-number application-step-number-cancel">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                                <span class="application-step-label">해지방법</span>
                                <svg class="application-accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div class="application-accordion-content" id="step-cancel">
                            <ul class="application-step-list">
                                <li>계약자, 운전자 신분증을 찍어서 <span class="application-step-highlight">010-4819-0574</span>로 전송</li>
                                <li>사고가 없으면 일할계산하여 보험료 환급</li>
                                <li>사고가 있을 경우엔 환급금이 없을 수도 있습니다</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right - Application Form -->
            <div class="application-form-card">
                <form id="application-form" class="application-form">
                    <!-- 보험 유형 선택 -->
                    <div class="application-form-row">
                        <label class="application-form-label">
                            보험유형 <span class="application-form-required">*</span>
                        </label>
                        <select id="insurance-type" name="insuranceType" required class="application-form-select">
                            <option value="">선택해주세요</option>
                            <option value="daeri">대리</option>
                            <option value="taksong">탁송</option>
                            <option value="hwakdae">확대탁송</option>
                            <option value="daeri-taksong">대리+탁송</option>
                            <option value="daeri-hwakdae">대리+확대</option>
                        </select>
                    </div>

                    <!-- 성명 -->
                    <div class="application-form-row">
                        <label for="name" class="application-form-label">
                            성명 <span class="application-form-required">*</span>
                        </label>
                        <input type="text" id="name" name="name" required maxlength="50" placeholder="대리기사 성명" class="application-form-input" />
                    </div>

                    <!-- 연락처 -->
                    <div class="application-form-row">
                        <label for="phone" class="application-form-label">
                            연락처 <span class="application-form-required">*</span>
                        </label>
                        <input type="tel" id="phone" name="phone" required placeholder="010-1234-5678" maxlength="13" class="application-form-input" />
                    </div>

                    <!-- 주민번호 -->
                    <div class="application-form-row application-form-row-start">
                        <label class="application-form-label application-form-label-top">
                            주민번호 <span class="application-form-required">*</span>
                        </label>
                        <div class="application-form-group">
                            <div class="application-form-resident-group">
                                <input type="text" id="resident-number-1" name="residentNumber1" required maxlength="6" placeholder="앞 6자리" class="application-form-input" />
                                <span class="application-form-dash">-</span>
                                <input type="password" id="resident-number-2" name="residentNumber2" required maxlength="7" placeholder="뒤 7자리" class="application-form-input" />
                            </div>
                            <div id="resident-number-error" class="application-form-error hidden"></div>
                            <div id="premium-calculating" class="application-form-info hidden">보험료 계산 중...</div>
                        </div>
                    </div>

                    <!-- 보험료 -->
                    <div class="application-form-row">
                        <label for="yearly-premium" class="application-form-label">
                            보험료 <span class="application-form-required">*</span>
                        </label>
                        <input type="text" id="yearly-premium" name="yearlyPremium" required placeholder="년보험료 (주민번호 입력 시 자동 계산)" class="application-form-input application-form-input-right" />
                    </div>

                    <!-- 1회보험료 -->
                    <div class="application-form-row">
                        <label for="first-premium" class="application-form-label">
                            1회보험료 <span class="application-form-required">*</span>
                        </label>
                        <input type="text" id="first-premium" name="firstPremium" required placeholder="1회차보험료 (주민번호 입력 시 자동 계산)" class="application-form-input application-form-input-right" />
                    </div>

                    <!-- 안내 문구 -->
                    <div class="application-form-notice">
                        <p>개인별 가입경력, 사고유무 등에 따라 보험료가 달리 적용될 수 있습니다.</p>
                        <p>해지 시, 사고가 있는 경우에는 해지환급금이 없을 수도 있습니다.</p>
                    </div>

                    <!-- 주소 -->
                    <div class="application-form-row application-form-row-start">
                        <label for="address" class="application-form-label application-form-label-top">
                            주소 <span class="application-form-required">*</span>
                        </label>
                        <div class="application-form-group">
                            <input type="text" id="address" name="address" required maxlength="200" placeholder="기본 주소" class="application-form-input" />
                            <input type="text" id="address-detail" name="addressDetail" maxlength="200" placeholder="상세 주소" class="application-form-input" />
                        </div>
                    </div>

                    <!-- 대리기사와 계약자 동일 체크박스 -->
                    <div class="application-form-row application-form-row-checkbox">
                        <input type="checkbox" id="is-same-person" name="isSamePerson" checked class="application-form-checkbox" />
                        <label for="is-same-person" class="application-form-checkbox-label">
                            대리기사와 계약자 동일
                        </label>
                    </div>

                    <!-- 계약자 정보 (대리기사와 다를 경우) -->
                    <div id="contractor-info" class="application-contractor-info hidden">
                        <p class="application-contractor-title">계약자 정보</p>
                        
                        <!-- 계약자 성명 -->
                        <div class="application-form-row">
                            <label for="contractor-name" class="application-form-label">
                                성명 <span class="application-form-required">*</span>
                            </label>
                            <input type="text" id="contractor-name" name="contractorName" maxlength="50" placeholder="계약자 성명" class="application-form-input" />
                        </div>

                        <!-- 계약자 주민번호 -->
                        <div class="application-form-row application-form-row-start">
                            <label class="application-form-label application-form-label-top">
                                주민번호 <span class="application-form-required">*</span>
                            </label>
                            <div class="application-form-group">
                                <div class="application-form-resident-group">
                                    <input type="text" id="contractor-resident-number-1" name="contractorResidentNumber1" maxlength="6" placeholder="앞 6자리" class="application-form-input" />
                                    <span class="application-form-dash">-</span>
                                    <input type="password" id="contractor-resident-number-2" name="contractorResidentNumber2" maxlength="7" placeholder="뒤 7자리" class="application-form-input" />
                                </div>
                                <div id="contractor-resident-number-error" class="application-form-error hidden"></div>
                            </div>
                        </div>

                        <!-- 계약자 전화번호 -->
                        <div class="application-form-row">
                            <label for="contractor-phone" class="application-form-label">
                                전화번호 <span class="application-form-required">*</span>
                            </label>
                            <input type="tel" id="contractor-phone" name="contractorPhone" placeholder="010-0000-0000" maxlength="13" class="application-form-input" />
                        </div>
                    </div>

                    <!-- 은행 계좌 -->
                    <div class="application-form-row">
                        <label class="application-form-label">
                            은행명 <span class="application-form-required">*</span>
                        </label>
                        <input type="text" id="bank-name" name="bankName" required maxlength="50" placeholder="은행명" class="application-form-input" />
                    </div>

                    <div class="application-form-row">
                        <label class="application-form-label">
                            계좌번호 <span class="application-form-required">*</span>
                        </label>
                        <input type="text" id="account-number" name="accountNumber" required maxlength="50" placeholder="계좌번호" class="application-form-input" />
                    </div>

                    <!-- 카드 결제 안내 -->
                    <div class="application-form-card-notice">
                        <p>1회차 보험료를 카드로 결제 하실 분들만 카드번호 입력하세요</p>
                    </div>

                    <!-- 카드번호 -->
                    <div class="application-form-row">
                        <label for="card-number" class="application-form-label">
                            카드번호
                        </label>
                        <input type="text" id="card-number" name="cardNumber" maxlength="50" placeholder="카드번호" class="application-form-input" />
                    </div>

                    <!-- 유효기간 -->
                    <div class="application-form-row">
                        <label for="card-expiry" class="application-form-label">
                            유효기간
                        </label>
                        <input type="text" id="card-expiry" name="cardExpiry" maxlength="10" placeholder="MM/YY" class="application-form-input" />
                    </div>

                    <!-- 개인정보 동의 -->
                    <div class="application-form-row application-form-row-checkbox">
                        <input type="checkbox" id="consent-privacy" name="consentPrivacy" required class="application-form-checkbox" />
                        <label for="consent-privacy" class="application-form-checkbox-label">
                            개인정보 수집 및 이용에 동의합니다 <span class="application-form-required">*</span>
                        </label>
                    </div>

                    <div id="application-error" class="application-form-error hidden"></div>

                    <!-- 제출 버튼 -->
                    <div class="application-form-submit">
                        <button type="submit" id="application-submit-btn" class="btn btn-primary btn-lg btn-full">
                            가입 신청하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // 이벤트 리스너
    setupEventListeners();
    setupAccordion();
}

function setupAccordion() {
    const triggers = document.querySelectorAll('.application-accordion-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const icon = trigger.querySelector('.application-accordion-icon');
            
            if (!content) return;
            
            // 다른 항목 닫기
            document.querySelectorAll('.application-accordion-content').forEach(item => {
                if (item !== content && !item.classList.contains('hidden')) {
                    item.classList.add('hidden');
                    const otherTrigger = document.querySelector(`[data-target="${item.id}"]`);
                    if (otherTrigger) {
                        const otherIcon = otherTrigger.querySelector('.application-accordion-icon');
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                }
            });
            
            // 현재 항목 토글
            content.classList.toggle('hidden');
            if (icon) {
                icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    });
}

function setupEventListeners() {
    // 전화번호 포맷팅
    const phoneInput = document.getElementById('phone');
    const contractorPhoneInput = document.getElementById('contractor-phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneInput);
    }
    if (contractorPhoneInput) {
        contractorPhoneInput.addEventListener('input', formatPhoneInput);
    }

    // 주민번호 입력 (숫자만)
    const resident1 = document.getElementById('resident-number-1');
    const resident2 = document.getElementById('resident-number-2');
    
    if (resident1) {
        resident1.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            if (e.target.value.length === 6 && resident2) {
                resident2.focus();
            }
            checkResidentNumber();
        });
    }
    
    if (resident2) {
        resident2.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            checkResidentNumber();
        });
    }

    // 계약자 주민번호 입력
    const contractorResident1 = document.getElementById('contractor-resident-number-1');
    const contractorResident2 = document.getElementById('contractor-resident-number-2');
    
    if (contractorResident1) {
        contractorResident1.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            if (e.target.value.length === 6 && contractorResident2) {
                contractorResident2.focus();
            }
            checkContractorResidentNumber();
        });
    }
    
    if (contractorResident2) {
        contractorResident2.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            checkContractorResidentNumber();
        });
    }

    // 계약자 동일인 여부 변경
    const isSamePersonCheck = document.getElementById('is-same-person');
    if (isSamePersonCheck) {
        isSamePersonCheck.addEventListener('change', (e) => {
            const contractorInfo = document.getElementById('contractor-info');
            if (e.target.checked) {
                contractorInfo.classList.add('hidden');
                const contractorName = document.getElementById('contractor-name');
                const contractorPhone = document.getElementById('contractor-phone');
                const contractorResident1 = document.getElementById('contractor-resident-number-1');
                const contractorResident2 = document.getElementById('contractor-resident-number-2');
                if (contractorName) contractorName.required = false;
                if (contractorPhone) contractorPhone.required = false;
                if (contractorResident1) contractorResident1.required = false;
                if (contractorResident2) contractorResident2.required = false;
            } else {
                contractorInfo.classList.remove('hidden');
                const contractorName = document.getElementById('contractor-name');
                const contractorPhone = document.getElementById('contractor-phone');
                const contractorResident1 = document.getElementById('contractor-resident-number-1');
                const contractorResident2 = document.getElementById('contractor-resident-number-2');
                if (contractorName) contractorName.required = true;
                if (contractorPhone) contractorPhone.required = true;
                if (contractorResident1) contractorResident1.required = true;
                if (contractorResident2) contractorResident2.required = true;
            }
        });
    }

    // 보험 유형 변경 시 보험료 재계산
    const insuranceType = document.getElementById('insurance-type');
    if (insuranceType) {
        insuranceType.addEventListener('change', () => {
            checkResidentNumber();
        });
    }

    // 폼 제출
    const form = document.getElementById('application-form');
    if (form) {
        form.addEventListener('submit', handleApplicationSubmit);
    }
}

function formatPhoneInput(e) {
    const numbers = e.target.value.replace(/\D/g, '');
    let formatted = numbers;
    if (numbers.length > 3 && numbers.length <= 7) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length > 7) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
    e.target.value = formatted;
}

async function checkResidentNumber() {
    const front = document.getElementById('resident-number-1')?.value || '';
    const back = document.getElementById('resident-number-2')?.value || '';
    const errorDiv = document.getElementById('resident-number-error');
    const insuranceType = document.getElementById('insurance-type')?.value || '';

    if (front.length !== 6 || back.length !== 7 || !insuranceType) {
        if (errorDiv) errorDiv.classList.add('hidden');
        const yearlyPremium = document.getElementById('yearly-premium');
        const firstPremium = document.getElementById('first-premium');
        if (yearlyPremium) yearlyPremium.value = '';
        if (firstPremium) firstPremium.value = '';
        return;
    }

    const validation = validateResidentNumber(front, back);
    if (!validation.isValid) {
        if (errorDiv) {
            errorDiv.textContent = validation.error || '주민번호가 올바르지 않습니다';
            errorDiv.classList.remove('hidden');
        }
        const yearlyPremium = document.getElementById('yearly-premium');
        const firstPremium = document.getElementById('first-premium');
        if (yearlyPremium) yearlyPremium.value = '';
        if (firstPremium) firstPremium.value = '';
        return;
    }

    if (errorDiv) errorDiv.classList.add('hidden');

    // 보험료 계산
    await calculatePremium(front, back, insuranceType);
}

async function checkContractorResidentNumber() {
    const front = document.getElementById('contractor-resident-number-1')?.value || '';
    const back = document.getElementById('contractor-resident-number-2')?.value || '';
    const errorDiv = document.getElementById('contractor-resident-number-error');

    if (front.length !== 6 || back.length !== 7) {
        if (errorDiv) errorDiv.classList.add('hidden');
        return;
    }

    const validation = validateResidentNumber(front, back);
    if (!validation.isValid) {
        if (errorDiv) {
            errorDiv.textContent = validation.error || '주민번호가 올바르지 않습니다';
            errorDiv.classList.remove('hidden');
        }
    } else {
        if (errorDiv) errorDiv.classList.add('hidden');
    }
}

async function calculatePremium(residentNumber1, residentNumber2, insuranceType) {
    if (isCalculatingPremium) return;
    
    isCalculatingPremium = true;
    const calculatingDiv = document.getElementById('premium-calculating');
    if (calculatingDiv) calculatingDiv.classList.remove('hidden');

    try {
        // 보험료 데이터 로드
        if (typeof premiumData === 'undefined' || premiumData.length === 0) {
            if (typeof fetchPremiumRates === 'function') {
                premiumData = await fetchPremiumRates();
            } else {
                console.error('fetchPremiumRates 함수를 찾을 수 없습니다');
                return;
            }
        }

        const validation = validateResidentNumber(residentNumber1, residentNumber2);
        if (!validation.isValid || !validation.ageGroup) {
            return;
        }

        // 기본 보험료 계산 (대인2 + 대물1억 + 자손5천 + 자차1천 + 법률비용)
        const ageGroup = validation.ageGroup;
        let insuranceTypeMap = {
            'daeri': '대리',
            'taksong': '탁송',
            'hwakdae': '확대탁송',
        };

        // 단일 보험 유형인 경우
        if (insuranceTypeMap[insuranceType]) {
            if (typeof calculateTotalPremium === 'function') {
                const yearlyPremium = calculateTotalPremium(premiumData, insuranceTypeMap[insuranceType], ageGroup, {
                    대인: '대인2',
                    대물: '대물1억',
                    자손: '자손5천',
                    자차: '자차1천',
                    법률비용: true,
                });
                const firstPremium = Math.round(yearlyPremium * 0.25);
                const yearlyPremiumInput = document.getElementById('yearly-premium');
                const firstPremiumInput = document.getElementById('first-premium');
                if (yearlyPremiumInput) yearlyPremiumInput.value = yearlyPremium.toLocaleString();
                if (firstPremiumInput) firstPremiumInput.value = firstPremium.toLocaleString();
            }
        } else {
            // 복합 보험 유형 (대리+탁송, 대리+확대)
            // 간단히 대리 보험료만 계산 (실제로는 더 복잡한 계산 필요)
            if (typeof calculateTotalPremium === 'function') {
                const yearlyPremium = calculateTotalPremium(premiumData, '대리', ageGroup, {
                    대인: '대인2',
                    대물: '대물1억',
                    자손: '자손5천',
                    자차: '자차1천',
                    법률비용: true,
                });
                const firstPremium = Math.round(yearlyPremium * 0.25);
                const yearlyPremiumInput = document.getElementById('yearly-premium');
                const firstPremiumInput = document.getElementById('first-premium');
                if (yearlyPremiumInput) yearlyPremiumInput.value = yearlyPremium.toLocaleString();
                if (firstPremiumInput) firstPremiumInput.value = firstPremium.toLocaleString();
            }
        }
    } catch (err) {
        console.error('보험료 계산 실패:', err);
    } finally {
        isCalculatingPremium = false;
        if (calculatingDiv) calculatingDiv.classList.add('hidden');
    }
}

async function handleApplicationSubmit(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('application-error');
    const submitBtn = document.getElementById('application-submit-btn');
    
    if (errorDiv) {
        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';
    }

    const formData = {
        insuranceType: document.getElementById('insurance-type')?.value || '',
        name: document.getElementById('name')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        residentNumber1: document.getElementById('resident-number-1')?.value.trim() || '',
        residentNumber2: document.getElementById('resident-number-2')?.value.trim() || '',
        yearlyPremium: document.getElementById('yearly-premium')?.value.replace(/,/g, '') || '',
        firstPremium: document.getElementById('first-premium')?.value.replace(/,/g, '') || '',
        address: document.getElementById('address')?.value.trim() || '',
        addressDetail: document.getElementById('address-detail')?.value.trim() || '',
        isSamePerson: document.getElementById('is-same-person')?.checked || false,
        contractorName: document.getElementById('contractor-name')?.value.trim() || null,
        contractorPhone: document.getElementById('contractor-phone')?.value.trim() || null,
        contractorResidentNumber1: document.getElementById('contractor-resident-number-1')?.value.trim() || null,
        contractorResidentNumber2: document.getElementById('contractor-resident-number-2')?.value.trim() || null,
        bankName: document.getElementById('bank-name')?.value.trim() || '',
        accountNumber: document.getElementById('account-number')?.value.trim() || '',
        cardNumber: document.getElementById('card-number')?.value.trim() || null,
        cardExpiry: document.getElementById('card-expiry')?.value.trim() || null,
        consentPrivacy: document.getElementById('consent-privacy')?.checked || false,
    };

    // 유효성 검사
    if (!formData.insuranceType) {
        if (errorDiv) {
            errorDiv.textContent = '보험 유형을 선택해주세요';
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    const residentValidation = validateResidentNumber(formData.residentNumber1, formData.residentNumber2);
    if (!residentValidation.isValid) {
        if (errorDiv) {
            errorDiv.textContent = residentValidation.error || '주민번호가 올바르지 않습니다';
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    if (!formData.isSamePerson) {
        if (!formData.contractorName || !formData.contractorPhone || !formData.contractorResidentNumber1 || !formData.contractorResidentNumber2) {
            if (errorDiv) {
                errorDiv.textContent = '계약자 정보를 모두 입력해주세요';
                errorDiv.classList.remove('hidden');
            }
            return;
        }
        const contractorValidation = validateResidentNumber(formData.contractorResidentNumber1, formData.contractorResidentNumber2);
        if (!contractorValidation.isValid) {
            if (errorDiv) {
                errorDiv.textContent = '계약자 주민번호가 올바르지 않습니다';
                errorDiv.classList.remove('hidden');
            }
            return;
        }
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '접수 중...';
    }

    try {
        const response = await fetch('/api/applications.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            const errorMsg = data.message || data.error || 'SUBMIT_FAILED';
            throw new Error(errorMsg);
        }

        // 성공
        alert('가입신청이 완료되었습니다.\n심사 결과는 담당자가 확인 후 문자로 안내드리겠습니다.');
        
        // 폼 초기화
        const form = document.getElementById('application-form');
        if (form) form.reset();
        const yearlyPremium = document.getElementById('yearly-premium');
        const firstPremium = document.getElementById('first-premium');
        if (yearlyPremium) yearlyPremium.value = '';
        if (firstPremium) firstPremium.value = '';
        const contractorInfo = document.getElementById('contractor-info');
        if (contractorInfo) contractorInfo.classList.add('hidden');
        const isSamePersonCheck = document.getElementById('is-same-person');
        if (isSamePersonCheck) isSamePersonCheck.checked = true;
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'SUBMIT_FAILED';
        if (errorDiv) {
            errorDiv.textContent = `가입신청에 실패했습니다. 잠시 후 다시 시도해주세요. (${errorMessage})`;
            errorDiv.classList.remove('hidden');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '가입 신청하기';
        }
    }
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApplicationForm);
} else {
    renderApplicationForm();
}
