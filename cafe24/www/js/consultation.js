/**
 * 상담신청 폼
 */

function renderConsultationForm() {
    const container = document.getElementById('consultation-form-container');
    if (!container) return;

    container.innerHTML = `
        <div class="consultation-grid">
            <!-- Left - Contact Methods -->
            <div class="consultation-contact-methods">
                <div class="consultation-contact-list">
                    <div class="consultation-contact-item">
                        <div class="consultation-contact-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                        </div>
                        <div class="consultation-contact-content">
                            <p class="consultation-contact-title">전화 상담</p>
                            <p class="consultation-contact-desc">평일 09:00 - 18:00</p>
                        </div>
                        <span class="consultation-contact-value">1588-0513</span>
                    </div>

                    <div class="consultation-contact-item">
                        <div class="consultation-contact-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                        </div>
                        <div class="consultation-contact-content">
                            <p class="consultation-contact-title">카카오톡 상담</p>
                            <p class="consultation-contact-desc">실시간 상담 가능</p>
                        </div>
                        <span class="consultation-contact-value">@심지글로벌</span>
                    </div>

                    <div class="consultation-contact-item">
                        <div class="consultation-contact-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="consultation-contact-content">
                            <p class="consultation-contact-title">24시간 접수</p>
                            <p class="consultation-contact-desc">사고 접수는 24시간</p>
                        </div>
                        <span class="consultation-contact-value">1588-0100</span>
                    </div>
                </div>
            </div>

            <!-- Right - Contact Form -->
            <div class="consultation-form-card">
                <form id="consultation-form" class="consultation-form">
                    <!-- 이름 -->
                    <div class="consultation-form-row">
                        <label for="consult-name" class="consultation-form-label">
                            이름 <span class="consultation-form-required">*</span>
                        </label>
                        <input
                            type="text"
                            id="consult-name"
                            name="name"
                            placeholder="홍길동"
                            required
                            maxlength="50"
                            class="consultation-form-input"
                        />
                    </div>

                    <!-- 연락처 -->
                    <div class="consultation-form-row">
                        <label for="consult-phone" class="consultation-form-label">
                            연락처 <span class="consultation-form-required">*</span>
                        </label>
                        <input
                            type="tel"
                            id="consult-phone"
                            name="phone"
                            placeholder="010-0000-0000"
                            required
                            maxlength="13"
                            class="consultation-form-input"
                        />
                    </div>

                    <!-- 상담 유형 -->
                    <div class="consultation-form-row">
                        <label for="consult-service-type" class="consultation-form-label">
                            상담 유형
                        </label>
                        <select
                            id="consult-service-type"
                            name="serviceType"
                            class="consultation-form-select"
                        >
                            <option value="">선택해주세요</option>
                            <option value="proxy">대리운전 보험</option>
                            <option value="delivery">탁송운전 보험</option>
                            <option value="claim">보상 문의</option>
                            <option value="other">기타 문의</option>
                        </select>
                    </div>

                    <!-- 문의 내용 -->
                    <div class="consultation-form-row consultation-form-row-start">
                        <label for="consult-message" class="consultation-form-label consultation-form-label-top">
                            문의 내용
                        </label>
                        <textarea
                            id="consult-message"
                            name="message"
                            placeholder="문의하실 내용을 입력해주세요."
                            rows="4"
                            class="consultation-form-textarea"
                        ></textarea>
                    </div>

                    <!-- 개인정보 동의 -->
                    <div class="consultation-form-row consultation-form-row-checkbox">
                        <input
                            type="checkbox"
                            id="consult-privacy"
                            name="consentPrivacy"
                            required
                            class="consultation-form-checkbox"
                        />
                        <label for="consult-privacy" class="consultation-form-checkbox-label">
                            개인정보 수집 및 이용에 동의합니다 <span class="consultation-form-required">*</span>
                        </label>
                    </div>

                    <div id="consult-error" class="consultation-form-error hidden"></div>

                    <button
                        type="submit"
                        id="consult-submit-btn"
                        class="btn btn-primary btn-lg btn-full"
                    >
                        상담 신청하기
                    </button>
                </form>
            </div>
        </div>
    `;

    // 전화번호 포맷팅
    const phoneInput = document.getElementById('consult-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const numbers = e.target.value.replace(/\D/g, '');
            let formatted = numbers;
            if (numbers.length > 3 && numbers.length <= 7) {
                formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
            } else if (numbers.length > 7) {
                formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
            }
            e.target.value = formatted;
        });
    }

    // 폼 제출
    const form = document.getElementById('consultation-form');
    if (form) {
        form.addEventListener('submit', handleConsultationSubmit);
    }
}

/**
 * 상담신청 폼 제출 핸들러
 */
async function handleConsultationSubmit(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('consult-error');
    const submitBtn = document.getElementById('consult-submit-btn');
    
    if (errorDiv) {
        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';
    }
    
    const formData = {
        name: document.getElementById('consult-name')?.value.trim() || '',
        phone: document.getElementById('consult-phone')?.value.trim() || '',
        serviceType: document.getElementById('consult-service-type')?.value || null,
        message: document.getElementById('consult-message')?.value.trim() || null,
        consentPrivacy: document.getElementById('consult-privacy')?.checked || false,
    };

    // 유효성 검사
    if (!formData.name || formData.name.length > 50) {
        if (errorDiv) {
            errorDiv.textContent = '이름을 입력해주세요 (최대 50자)';
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        if (errorDiv) {
            errorDiv.textContent = '올바른 전화번호를 입력해주세요';
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    if (!formData.consentPrivacy) {
        if (errorDiv) {
            errorDiv.textContent = '개인정보 수집 및 이용에 동의해주세요';
            errorDiv.classList.remove('hidden');
        }
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '접수 중...';
    }

    try {
        const response = await fetch('/api/consultations.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.error || 'SUBMIT_FAILED');
        }

        // 성공
        alert('상담신청이 완료되었습니다.\n담당자가 확인 후 곧 연락드리겠습니다.');
        
        // 폼 초기화
        const form = document.getElementById('consultation-form');
        if (form) form.reset();
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'SUBMIT_FAILED';
        if (errorDiv) {
            errorDiv.textContent = `접수에 실패했습니다. 잠시 후 다시 시도해주세요. (${errorMessage})`;
            errorDiv.classList.remove('hidden');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '상담 신청하기';
        }
    }
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderConsultationForm);
} else {
    renderConsultationForm();
}
