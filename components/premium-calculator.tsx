"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Play } from "lucide-react";

const ageGroups = [
	{ label: "26세~30세", range: "[ 1995-01-21 ~ 2000-01-22 ]" },
	{ label: "31세~45세", range: "[ 1980-01-21 ~ 1995-01-22 ]" },
	{ label: "46세~50세", range: "[ 1975-01-21 ~ 1980-01-22 ]" },
	{ label: "51세~55세", range: "[ 1970-01-21 ~ 1975-01-22 ]" },
	{ label: "56세~60세", range: "[ 1965-01-21 ~ 1970-01-22 ]" },
	{ label: "61세 이상", range: "[ ~ 1965-01-22 ]" },
];

const premiumData: Record<string, Record<string, string[]>> = {
	"30만/30만": {
		대인1억: [
			"15,000",
			"13,500",
			"12,000",
			"11,000",
			"10,500",
			"10,000",
		],
		대인2억: [
			"18,000",
			"16,200",
			"14,400",
			"13,200",
			"12,600",
			"12,000",
		],
	},
	"50만/50만": {
		대인1억: [
			"18,500",
			"16,650",
			"14,800",
			"13,550",
			"12,950",
			"12,300",
		],
		대인2억: [
			"22,200",
			"19,980",
			"17,760",
			"16,260",
			"15,540",
			"14,760",
		],
	},
	"1억/1억": {
		대인1억: [
			"22,000",
			"19,800",
			"17,600",
			"16,100",
			"15,400",
			"14,600",
		],
		대인2억: [
			"26,400",
			"23,760",
			"21,120",
			"19,320",
			"18,480",
			"17,520",
		],
	},
};

export default function PremiumCalculator() {
	const [daein, setDaein] = useState("책임초과무한");
	const [daemul, setDaemul] = useState("3천");
	const [jason, setJason] = useState("3천");
	const [charyang, setCharyang] = useState("3천");
	const [jabidamgeum, setJabidamgeum] = useState("30만");
	const [calculated, setCalculated] = useState(false);

	const handleCalculate = () => {
		setCalculated(true);
	};

	const getCurrentPremiums = () => {
		const charyangKey = charyang as keyof typeof premiumData;
		const daeinKey = daein as keyof (typeof premiumData)[typeof charyangKey];
		return premiumData[charyangKey]?.[daeinKey] || premiumData["30만/30만"]["대인1억"];
	};

	return (
		<section id="premium-calculator" className="py-16 bg-background">
			<div className="container mx-auto px-4 max-w-5xl">
				<div className="border border-border rounded-lg overflow-hidden bg-card">
					{/* Header */}
					<div className="bg-secondary px-4 py-3 border-b border-border">
						<h2 className="text-lg font-semibold text-foreground text-center">
							보험료 적용 기준일{" "}
							<span className="text-primary font-bold">2026-01-22</span>
						</h2>
					</div>

					{/* Filters */}
					<div className="p-4 border-b border-border bg-muted/30">
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-center gap-2 sm:gap-3">
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

							<Select value={charyang} onValueChange={setCharyang}>
								<SelectTrigger className="w-full lg:w-[130px] bg-card text-xs sm:text-sm">
									<span className="text-muted-foreground mr-1">차량</span>
									<span className="font-medium">{charyang}</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="3천">3천</SelectItem>
									<SelectItem value="5천">5천</SelectItem>
								</SelectContent>
							</Select>

							<Select value={jabidamgeum} onValueChange={setJabidamgeum}>
								<SelectTrigger className="w-full lg:w-[150px] bg-card text-xs sm:text-sm">
									<span className="text-muted-foreground mr-1">자부담</span>
									<span className="font-medium">{jabidamgeum}</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="30만">30만원</SelectItem>
									<SelectItem value="50만">50만원</SelectItem>
								</SelectContent>
							</Select>

							<Button
								onClick={handleCalculate}
								className="col-span-2 sm:col-span-1 w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
							>
								<Play className="w-4 h-4" />
								산출
							</Button>
						</div>
					</div>

					{/* 모바일: 카드 형식 */}
					<div className="lg:hidden p-4 space-y-4">
						{ageGroups.map((age, index) => {
							const premiums = getCurrentPremiums();
							const basePremium = calculated
								? Number.parseInt(premiums[index].replace(",", ""))
								: 0;

							return (
								<div
									key={age.label}
									className="bg-muted/30 rounded-lg p-4 space-y-3"
								>
									<div className="border-b border-border pb-2">
										<div className="text-primary font-bold text-base">
											{age.label}
										</div>
										<div className="text-muted-foreground text-xs mt-1">
											{age.range}
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">대리</span>
											<span className="text-sm font-semibold text-accent">
												{calculated ? `${premiums[index]}원` : "-"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">일반탁송</span>
											<span className="text-sm font-semibold text-accent">
												{calculated
													? `${Math.round(basePremium * 1.1).toLocaleString()}원`
													: "-"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">확대탁송</span>
											<span className="text-sm font-semibold text-accent">
												{calculated
													? `${Math.round(basePremium * 1.25).toLocaleString()}원`
													: "-"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">대리+탁송</span>
											<span className="text-sm font-semibold text-accent">
												{calculated
													? `${Math.round(basePremium * 1.8).toLocaleString()}원`
													: "-"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">대리+확대</span>
											<span className="text-sm font-semibold text-accent">
												{calculated
													? `${Math.round(basePremium * 2.0).toLocaleString()}원`
													: "-"}
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
								{ageGroups.map((age, index) => {
									const premiums = getCurrentPremiums();
									const basePremium = calculated
										? Number.parseInt(premiums[index].replace(",", ""))
										: 0;

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
											<td className="px-2 py-4 text-center border-r border-border font-medium text-foreground">
												{calculated ? `${premiums[index]}원` : "-"}
											</td>
											<td className="px-2 py-4 text-center border-r border-border font-medium text-foreground">
												{calculated
													? `${Math.round(basePremium * 1.1).toLocaleString()}원`
													: "-"}
											</td>
											<td className="px-2 py-4 text-center border-r border-border font-medium text-foreground">
												{calculated
													? `${Math.round(basePremium * 1.25).toLocaleString()}원`
													: "-"}
											</td>
											<td className="px-2 py-4 text-center border-r border-border font-medium text-foreground">
												{calculated
													? `${Math.round(basePremium * 1.8).toLocaleString()}원`
													: "-"}
											</td>
											<td className="px-2 py-4 text-center font-medium text-foreground">
												{calculated
													? `${Math.round(basePremium * 2.0).toLocaleString()}원`
													: "-"}
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
									1회차 25%, 2회차~7회차 10%, 8회차~10회차 5% 입니다
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
