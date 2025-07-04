'use client';

// 디자인 감성을 살리기 위해 react-icons에서 몇 가지 아이콘을 더 가져옵니다.
import {
    FaHeart,
    FaPenFancy,
    FaComments,
    FaRegLightbulb,
    FaUserFriends,
    FaQuoteLeft,
    FaSeedling,
} from 'react-icons/fa';

// 이미지의 디자인을 재현하기 위해 컴포넌트 구조와 스타일을 크게 변경합니다.
// 기존 Smallhead 컴포넌트 대신 직접 스타일링을 적용하여 이미지의 폰트 느낌을 살립니다.

export default function ProjectPage() {
    // 이미지의 색상 팔레트를 정의합니다.
    const brandColors = {
        background: '#F7F9FF', // 매우 밝은 하늘색 배경
        textPrimary: '#1F2937', // 기본 텍스트 색상 (진한 회색)
        textSecondary: '#4B5563', // 보조 텍스트 색상 (회색)
        accent: '#3B82F6', // 포인트 블루 색상
    };

    // 배경에 흩뿌려진 아이콘들을 위한 컴포넌트
    const BackgroundIcons = () => (
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
            {/* 아이콘들을 화면 곳곳에 배치합니다. */}
            <FaRegLightbulb className="absolute top-[10%] left-[15%] text-blue-100 text-5xl opacity-80 -rotate-12" />
            <FaSeedling className="absolute top-[20%] right-[10%] text-blue-100 text-6xl opacity-80 rotate-12" />
            <FaQuoteLeft className="absolute bottom-[25%] left-[5%] text-blue-100 text-4xl opacity-80" />
            <FaUserFriends className="absolute bottom-[10%] right-[15%] text-blue-100 text-5xl opacity-80 rotate-6" />
        </div>
    );

    return (
        // 전체 페이지의 배경색과 기본 텍스트 색상을 설정합니다.
        <main className="text-gray-900" style={{ backgroundColor: brandColors.background }}>
            <div className="relative overflow-hidden">
                <BackgroundIcons />

                {/* 헤더 섹션: 이미지의 메인 타이틀 부분을 재현합니다. */}
                <section className="py-32 px-6 text-center">
                    <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4">
                        <span className="bg-gray-800 text-white text-sm font-bold py-2 px-5 rounded-full">
                            쉼표 프로젝트
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold" style={{ color: brandColors.textPrimary }}>
                            킬링타임이 아닌,
                        </h1>
                        <h2
                            className="text-5xl md:text-6xl font-extrabold"
                            style={{
                                color: brandColors.accent,
                                // 이미지의 '돋보임' 폰트처럼 살짝 기울여 장난스러운 느낌을 줍니다.
                                transform: 'rotate(-2deg)',
                            }}
                        >
                            힐링타임
                        </h2>
                        <p className="pt-4 text-lg font-light" style={{ color: brandColors.textSecondary }}>
                            2024.01.01 - 2024.12.31
                        </p>
                    </div>
                </section>
            </div>

            {/* 소개 문구 섹션: 이미지의 손글씨 느낌 부분을 재현합니다. */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <p
                        className="text-2xl md:text-3xl leading-relaxed font-medium"
                        style={{ color: brandColors.accent, fontFamily: "'Gaegu', cursive" }} // 손글씨 느낌의 폰트 (별도 import 필요)
                    >
                        {/* FIX: 큰따옴표를 HTML 엔티티로 수정 */}
                        “지친 당신의 삶에,
                        <br />
                        아름다운 쉼표 하나를 놓아보세요.”
                    </p>
                    <h3 className="text-3xl font-bold pt-8" style={{ color: brandColors.textPrimary }}>
                        쉼표 프로젝트의 발걸음
                    </h3>
                </div>
            </section>

            {/* 타임라인 섹션: 이미지의 타임라인 디자인을 차용하여 프로젝트 소개를 재구성합니다. */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="relative border-l-2 border-dashed border-blue-300 ml-6 md:ml-0 md:border-l-0 md:border-t-2">
                        {/* 각 타임라인 아이템 */}
                        <div className="mb-12 md:flex md:items-start md:space-x-8">
                            <div className="z-10 bg-white p-1 rounded-full border-2 border-blue-300 -ml-10 md:ml-0 md:-mt-5">
                                <div className="bg-pink-500 text-white w-14 h-14 rounded-full flex items-center justify-center">
                                    <FaHeart className="text-2xl" />
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <h4 className="text-xl font-bold" style={{ color: brandColors.textPrimary }}>
                                    왜 쉼표 프로젝트인가요?
                                </h4>
                                <p
                                    className="mt-2 text-base leading-relaxed"
                                    style={{ color: brandColors.textSecondary }}
                                >
                                    {/* FIX: 작은따옴표들을 HTML 엔티티로 수정 */}
                                    2030 청년의 삶에 ‘쉼’이 사라지고 있습니다. 진로, 관계, 번아웃... 우리는 ‘버티는
                                    법’에만 익숙해져 있어요. 지금 필요한 건 멈춤이 아닌, 더 나아가기 위한 ‘쉼표’입니다.
                                </p>
                            </div>
                        </div>

                        <div className="mb-12 md:flex md:items-start md:flex-row-reverse md:space-x-reverse md:space-x-8 md:text-right">
                            <div className="z-10 bg-white p-1 rounded-full border-2 border-blue-300 -ml-10 md:ml-0 md:-mt-5 md:-mr-9">
                                <div className="bg-amber-500 text-white w-14 h-14 rounded-full flex items-center justify-center">
                                    <FaPenFancy className="text-2xl" />
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <h4 className="text-xl font-bold" style={{ color: brandColors.textPrimary }}>
                                    무엇을 하나요?
                                </h4>
                                <p
                                    className="mt-2 text-base leading-relaxed"
                                    style={{ color: brandColors.textSecondary }}
                                >
                                    {/* FIX: 작은따옴표를 HTML 엔티티로 수정 */}
                                    독립출판 작가들과 1:1 코칭을 진행해요. 대화, 글쓰기, 표현을 통해 나를 돌아보고
                                    재정비하는 시간. 진짜 ‘쉼’이 필요한 당신을 위한 힐링 프로젝트입니다.
                                </p>
                            </div>
                        </div>

                        <div className="md:flex md:items-start md:space-x-8">
                            <div className="z-10 bg-white p-1 rounded-full border-2 border-blue-300 -ml-10 md:ml-0 md:-mt-5">
                                <div className="bg-indigo-500 text-white w-14 h-14 rounded-full flex items-center justify-center">
                                    <FaComments className="text-2xl" />
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <h4 className="text-xl font-bold" style={{ color: brandColors.textPrimary }}>
                                    어떻게 진행되나요?
                                </h4>
                                <p
                                    className="mt-2 text-base leading-relaxed"
                                    style={{ color: brandColors.textSecondary }}
                                >
                                    신청서 작성 → 작가 매칭 → 1:1 코칭(2~3회)의 순서로 진행됩니다. 온라인/오프라인 모두
                                    가능하며, 진로부터 감정, 창작까지 자유롭게 주제를 정할 수 있어요.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 하이라이트 카드 섹션: 이미지 하단의 데이터 카드 디자인을 적용합니다. */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h3 className="text-3xl font-bold mb-12" style={{ color: brandColors.textPrimary }}>
                        참여자들이 경험한 변화
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                badge: '이런 분들께 추천해요',
                                content: '2030 청년 누구나!',
                                sub: '고민이 많지만 정리할 시간이 없는 분',
                            },
                            {
                                badge: '가장 많이 나온 후기',
                                content: '“나만 그런 게 아니었구나”',
                                sub: '공감과 위로를 얻었어요',
                            },
                            {
                                badge: '가장 큰 변화',
                                content: '“생각이 정리되었어요”',
                                sub: '말로 표현하며 나를 다시 보게 됐어요',
                            },
                            {
                                badge: '우리가 찾는 사람',
                                content: '“새로운 나를 만나고픈 당신”',
                                sub: '글쓰기로 자신을 들여다보고 싶은 분',
                            },
                        ].map((card, idx) => (
                            <div
                                key={idx}
                                className="bg-slate-50 p-6 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between"
                            >
                                <span className="inline-block bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full mb-4 self-center">
                                    {card.badge}
                                </span>
                                <p
                                    className="text-xl font-bold flex-grow flex items-center justify-center"
                                    style={{ color: brandColors.textPrimary }}
                                >
                                    {card.content}
                                </p>
                                <p className="text-sm mt-3" style={{ color: brandColors.textSecondary }}>
                                    {card.sub}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 신청 안내 섹션 */}
            <section className="py-24 px-6 text-center" style={{ backgroundColor: brandColors.background }}>
                <div className="max-w-3xl mx-auto space-y-8">
                    <h3 className="text-3xl font-bold" style={{ color: brandColors.textPrimary }}>
                        지금 바로, 쉼표를 찍어보세요
                    </h3>
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <p
                            className="text-lg leading-relaxed text-left space-y-2"
                            style={{ color: brandColors.textSecondary }}
                        >
                            <span className="font-bold text-gray-700">📆 신청 기간:</span> ~ 2025.00.00 <br />
                            <span className="font-bold text-gray-700">💌 신청 방법:</span> 아래 버튼 클릭 후 구글폼 제출{' '}
                            <br />
                            <span className="font-bold text-gray-700">📍 문　　의:</span> @쉼표프로젝트 인스타그램 DM
                        </p>
                    </div>
                    <button
                        className="w-full max-w-sm mt-6 py-4 px-8 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300"
                        style={{ backgroundColor: brandColors.accent, letterSpacing: '1px' }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandColors.accent)}
                    >
                        신청하러 가기
                    </button>
                </div>
            </section>
        </main>
    );
}
