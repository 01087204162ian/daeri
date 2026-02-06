"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Play, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	fetchPremiumRates,
	calculateTotalPremium,
	type AgeGroup,
	type InsuranceType,
	type PremiumData,
} from "@/lib/premium-data-client";

/**
 * 나이대별 생년월일 범위 계산 함수
 * 기준일: 현재 날짜
 * 
 * 예시: 기준일 2026-02-06, 26세~30세
 * - 만 26세: 2000-02-06 이전 출생 → 2000-02-05까지
 * - 만 30세: 1996-02-06 이후 출생 → 1996-02-06부터
 * - 범위: 1996-02-06 ~ 2000-02-05
 */
function calculateAgeRange(ageGroup: AgeGroup): string {
	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate();

	let minAge: number;
	let maxAge: number;

	switch (ageGroup) {
		case "26~30":
			minAge = 26;
			maxAge = 30;
			break;
		case "31~45":
			minAge = 31;
			maxAge = 45;
			break;
		case "46~50":
			minAge = 46;
			maxAge = 50;
			break;
		case "51~55":
			minAge = 51;
			maxAge = 55;
			break;
		case "56~60":
			minAge = 56;
			maxAge = 60;
			break;
		case "61~":
			// 61세 이상: 기준일 기준 만 61세 이상
			// 만 61세가 되는 가장 늦은 생년월일 계산
			const birthYear61 = currentYear - 61;
			const birthDate61 = new Date(birthYear61, currentMonth, currentDay);
			// 생일이 지나지 않았으면 1년 빼기
			if (birthDate61 > today) {
				birthDate61.setFullYear(birthYear61 - 1);
			}
			return `[ ~ ${birthDate61.toISOString().split('T')[0]} ]`;
		default:
			return "";
	}

	// 최대 나이(maxAge)의 생년월일 (가장 어린 경우, 즉 가장 늦게 태어난 경우)
	// 예: 만 30세 → 1996-02-06 이후 출생 → 1996-02-06부터
	const maxBirthYear = currentYear - maxAge;
	const maxBirthDate = new Date(maxBirthYear, currentMonth, currentDay);
	// 생일이 지나지 않았으면 1년 빼기 (만 나이 계산)
	if (maxBirthDate > today) {
		maxBirthDate.setFullYear(maxBirthYear - 1);
	}

	// 최소 나이(minAge)의 생년월일 (가장 나이 많은 경우, 즉 가장 일찍 태어난 경우)
	// 예: 만 26세 → 2000-02-06 이전 출생 → 2000-02-05까지
	const minBirthYear = currentYear - minAge;
	const minBirthDate = new Date(minBirthYear, currentMonth, currentDay);
	// 생일이 지나지 않았으면 1년 빼기 (만 나이 계산)
	if (minBirthDate > today) {
		minBirthDate.setFullYear(minBirthYear - 1);
	}
	// 하루 전으로 설정 (이전 출생이므로)
	minBirthDate.setDate(minBirthDate.getDate() - 1);

	// 범위: 가장 어린 경우(늦게 태어남) ~ 가장 나이 많은 경우(일찍 태어남)
	const minDateStr = maxBirthDate.toISOString().split('T')[0]; // 가장 어린 경우 (늦게 태어남)
	const maxDateStr = minBirthDate.toISOString().split('T')[0]; // 가장 나이 많은 경우 (일찍 태어남)

	return `[ ${minDateStr} ~ ${maxDateStr} ]`;
}

const ageGroups: Array<{ label: string; range: string; ageGroup: AgeGroup }> = [
	{ label: "26세~30세", range: calculateAgeRange("26~30"), ageGroup: "26~30" },
	{ label: "31세~45세", range: calculateAgeRange("31~45"), ageGroup: "31~45" },
	{ label: "46세~50세", range: calculateAgeRange("46~50"), ageGroup: "46~50" },
	{ label: "51세~55세", range: calculateAgeRange("51~55"), ageGroup: "51~55" },
	{ label: "56세~60세", range: calculateAgeRange("56~60"), ageGroup: "56~60" },
	{ label: "61세 이상", range: calculateAgeRange("61~"), ageGroup: "61~" },
];

export default function PremiumCalculator() {
	const [premiumData, setPremiumData] = useState<PremiumData[]>([]);
	const [loading, setLoading] = useState(false);
	const [daein, setDaein] = useState("책임초과무한"); // 책임초과무한 = 대인2, 책임포함무한 = 대인2+대인1특약
	const [daemul, setDaemul] = useState("3천");
	const [jason, setJason] = useState("3천");
	const [jacha, setJacha] = useState("1천");
	const [rentCost, setRentCost] = useState(false); // 렌트비용
	const [legalCost, setLegalCost] = useState(true); // 법률비용 (기본값: 포함)
	const [calculated, setCalculated] = useState(false);

	const handleCalculate = async () => {
		// 데이터가 없으면 먼저 로드
		if (premiumData.length === 0) {
			setLoading(true);
			try {
				const data = await fetchPremiumRates();
				setPremiumData(data);
				setCalculated(true);
			} catch (error) {
				console.error("보험료 데이터 로딩 실패:", error);
			} finally {
				setLoading(false);
			}
		} else {
			// 데이터가 이미 있으면 바로 계산
			setCalculated(true);
		}
	};

	// 보험료 계산 함수
	const calculatePremium = (insuranceType: InsuranceType, ageGroup: AgeGroup): number => {
		if (premiumData.length === 0) return 0;
		const 대인 = daein === "책임초과무한" ? "대인2" : "대인1특약";
		const 대물 = `대물${daemul}` as "대물3천" | "대물5천" | "대물1억" | "대물2억";
		const 자손 = `자손${jason}` as "자손3천" | "자손5천" | "자손1억";
		const 자차 = `자차${jacha}` as "자차1천" | "자차2천" | "자차3천";

		// 책임포함무한인 경우 대인2 + 대인1특약을 모두 더해야 함
		if (daein === "책임포함무한") {
			const 대인2보험료 = calculateTotalPremium(premiumData, insuranceType, ageGroup, {
				대인: "대인2",
				대물,
				자손,
				자차,
				렌트비용: rentCost,
				법률비용: legalCost,
			});
			const 대인1특약보험료 = calculateTotalPremium(premiumData, insuranceType, ageGroup, {
				대인: "대인1특약",
				대물: undefined,
				자손: undefined,
				자차: undefined,
				렌트비용: false,
				법률비용: false,
			});
			return 대인2보험료 + 대인1특약보험료;
		} else {
			// 책임초과무한 = 대인2만
			return calculateTotalPremium(premiumData, insuranceType, ageGroup, {
				대인: "대인2",
				대물,
				자손,
				자차,
				렌트비용: rentCost,
				법률비용: legalCost,
			});
		}
	};

	if (loading) {
		return (
			<section id="premium-calculator" className="py-16 bg-background">
				<div className="container mx-auto px-4 max-w-5xl">
					<div className="border border-border rounded-lg overflow-hidden bg-card p-8 text-center">
						<p className="text-muted-foreground">보험료 데이터를 불러오는 중...</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="premium-calculator" className="py-16 bg-background">
			<div className="container mx-auto px-4 max-w-5xl">
				<div className="border border-border rounded-lg overflow-hidden bg-card">
					{/* Header */}
					<div className="bg-secondary px-4 py-3 border-b border-border">
						<h2 className="text-lg font-semibold text-foreground text-center">
							보험료 적용 기준일{" "}
							<span className="text-primary font-bold">
								{new Date().toISOString().split('T')[0]}
							</span>
						</h2>
					</div>

					{/* Filters */}
					<div className="p-4 border-b border-border bg-muted/30">
						<div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-nowrap items-center gap-2 sm:gap-3">
							<Select value={daein} onValueChange={setDaein}>
								<SelectTrigger className="w-full lg:w-[200px] bg-card text-xs sm:text-sm">
									<span className="text-muted-foreground mr-1">대인</span>
									<span className="font-medium truncate">{daein === "책임초과무한" ? "책임초과" : "책임포함"}</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="책임초과무한">책임초과 무한</SelectItem>
									<SelectItem value="책임포함무한">책임포함 무한</SelectItem>
								</SelectContent>
							</Select>

							<Select value={daemul} onValueChange={setDaemul}>
								<SelectTrigger className="w-full lg:w-[130px] bg-card text-xs sm:text-sm">
									<span className="text-muted-foreground mr-1">대물</span>
									<span className="font-medium">{daemul}</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="3천">3천</SelectItem>
									<SelectItem value="5천">5천</SelectItem>
									<SelectItem value="1억">1억</SelectItem>
									<SelectItem value="2억">2억</SelectItem>
								</SelectContent>
							</Select>

							<Select value={jason} onValueChange={setJason}>
								<SelectTrigger className="w-full lg:w-[130px] bg-card text-xs sm:text-sm">
									<span className="text-muted-foreground mr-1">자손</span>
									<span className="font-medium">{jason}</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="3천">3천</SelectItem>
									<SelectItem value="5천">5천</SelectItem>
									<SelectItem value="1억">1억</SelectItem>
								</SelectContent>
							</Select>

							<Select value={jacha} onValueChange={setJacha}>
								<SelectTrigger className="w-full lg:w-[130px] bg-card text-xs sm:text-sm">
									<span className="text-muted-foreground mr-1">자차</span>
									<span className="font-medium">{jacha}</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1천">1천</SelectItem>
									<SelectItem value="2천">2천</SelectItem>
									<SelectItem value="3천">3천</SelectItem>
								</SelectContent>
							</Select>

							{/* 렌트비용 체크박스 */}
							<div className="flex items-center gap-1.5 px-2 py-2 bg-card rounded-md border border-border shrink-0">
								<Checkbox
									id="rent-cost"
									checked={rentCost}
									onCheckedChange={(checked) => setRentCost(checked === true)}
								/>
								<label
									htmlFor="rent-cost"
									className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1 whitespace-nowrap"
								>
									렌트
									<span className="text-muted-foreground text-[10px]">(대리)</span>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="w-3 h-3 text-muted-foreground cursor-help shrink-0" />
										</TooltipTrigger>
										<TooltipContent>
											<p>렌트비용은 대리운전 보험에만 적용됩니다</p>
										</TooltipContent>
									</Tooltip>
								</label>
							</div>

							{/* 법률비용 체크박스 */}
							<div className="flex items-center gap-1.5 px-2 py-2 bg-card rounded-md border border-border shrink-0">
								<Checkbox
									id="legal-cost"
									checked={legalCost}
									onCheckedChange={(checked) => setLegalCost(checked === true)}
								/>
								<label
									htmlFor="legal-cost"
									className="text-xs font-medium text-foreground cursor-pointer whitespace-nowrap"
								>
									법률
								</label>
							</div>

							<Button
								onClick={handleCalculate}
								disabled={loading}
								className="col-span-2 sm:col-span-4 lg:col-span-1 w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shrink-0"
							>
								<Play className="w-4 h-4" />
								{loading ? "로딩 중..." : "산출"}
							</Button>
						</div>
					</div>

					{/* 모바일: 카드 형식 */}
					<div className="lg:hidden p-4 space-y-4">
						{ageGroups.map((age) => {
							const 대리보험료 = calculated ? calculatePremium("대리", age.ageGroup) : 0;
							const 탁송보험료 = calculated ? calculatePremium("탁송", age.ageGroup) : 0;
							const 확대탁송보험료 = calculated ? calculatePremium("확대탁송", age.ageGroup) : 0;

							return (
								<div
									key={age.label}
									className="bg-muted/30 rounded-lg p-4 space-y-3"
								>
									<div className="border-b border-border pb-2">
										<div className="flex items-center gap-2 flex-wrap">
											<div className="text-primary font-bold text-base">
												{age.label}
											</div>
											<div className="text-muted-foreground text-xs">
												{age.range}
											</div>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">대리</span>
											<span className="text-sm font-semibold text-accent">
												{calculated ? 대리보험료.toLocaleString() : "-"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">일반탁송</span>
											<span className="text-sm font-semibold text-accent">
												{calculated ? 탁송보험료.toLocaleString() : "-"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">확대탁송</span>
											<span className="text-sm font-semibold text-accent">
												{calculated ? 확대탁송보험료.toLocaleString() : "-"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">대리+탁송</span>
											<span className="text-sm font-semibold text-accent">
												{calculated ? (대리보험료 + 탁송보험료).toLocaleString() : "-"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">대리+확대</span>
											<span className="text-sm font-semibold text-accent">
												{calculated ? (대리보험료 + 확대탁송보험료).toLocaleString() : "-"}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* 데스크톱: 테이블 형식 */}
					<div className="hidden lg:block overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-secondary border-b border-border">
									<th className="w-[16%] px-2 py-3 text-center font-semibold text-foreground border-r border-border whitespace-nowrap">
										년령
									</th>
									<th className="w-[14%] px-2 py-3 text-center font-semibold text-foreground border-r border-border whitespace-nowrap">
										대리
									</th>
									<th className="w-[14%] px-2 py-3 text-center font-semibold text-foreground border-r border-border whitespace-nowrap">
										일반탁송
									</th>
									<th className="w-[14%] px-2 py-3 text-center font-semibold text-foreground border-r border-border whitespace-nowrap">
										확대탁송
									</th>
									<th className="w-[14%] px-2 py-3 text-center font-semibold text-foreground border-r border-border whitespace-nowrap">
										대리+탁송
									</th>
									<th className="w-[14%] px-2 py-3 text-center font-semibold text-foreground whitespace-nowrap">
										대리+확대
									</th>
								</tr>
							</thead>
							<tbody>
								{ageGroups.map((age) => {
									const 대리보험료 = calculated ? calculatePremium("대리", age.ageGroup) : 0;
									const 탁송보험료 = calculated ? calculatePremium("탁송", age.ageGroup) : 0;
									const 확대탁송보험료 = calculated ? calculatePremium("확대탁송", age.ageGroup) : 0;

									return (
										<tr
											key={age.label}
											className="border-b border-border hover:bg-muted/50 transition-colors"
										>
											<td className="px-2 py-4 border-r border-border">
												<div className="text-center">
													<span className="text-primary font-semibold block text-sm">
														{age.label}
													</span>
													<span className="text-muted-foreground text-xs">
														{age.range}
													</span>
												</div>
											</td>
											<td className="px-2 py-4 text-right border-r border-border font-medium text-foreground">
												{calculated ? 대리보험료.toLocaleString() : "-"}
											</td>
											<td className="px-2 py-4 text-right border-r border-border font-medium text-foreground">
												{calculated ? 탁송보험료.toLocaleString() : "-"}
											</td>
											<td className="px-2 py-4 text-right border-r border-border font-medium text-foreground">
												{calculated ? 확대탁송보험료.toLocaleString() : "-"}
											</td>
											<td className="px-2 py-4 text-right border-r border-border font-medium text-foreground">
												{calculated ? (대리보험료 + 탁송보험료).toLocaleString() : "-"}
											</td>
											<td className="px-2 py-4 text-right font-medium text-foreground">
												{calculated ? (대리보험료 + 확대탁송보험료).toLocaleString() : "-"}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Footer Notes */}
					<div className="p-4 bg-muted/30 border-t border-border">
						<ul className="space-y-1.5 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>
									상기 보험료는 DB손해보험 개인대리운전 보험료 입니다
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>
									보험료 계산식: 대인보험료 + 대물보험료 + 자손보험료 + 자차보험료 + 렌트비용(선택, 대리만) + 법률비용(선택)
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>
									렌트비용은 대리운전 보험에만 적용되며, 탁송/확대탁송에는 적용되지 않습니다
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>
									책임초과무한 = 대인2, 책임포함무한 = 대인2 + 대인1특약
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>만 26세이하는 가입을 할 수 없습니다</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-accent mt-1">•</span>
								<span className="text-accent">
									더 자세한 상담을 원하시면 상담 신청하시면 바로 연락
									드리겠습니다
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-accent mt-1">•</span>
								<span className="text-accent">
									상담신청하시면 신청하신분과 당사 담당자에게 문자가 갑니다
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>당사 담당자가 바로 전화 드릴 것 입니다</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
