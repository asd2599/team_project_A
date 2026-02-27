import React from "react";

const PetStatusPage = ({ petData }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-4xl border border-white/50 flex flex-col md:flex-row items-center gap-12">
      {/* 펫 렌더링 영역 */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-64 h-64 bg-slate-100 rounded-full flex justify-center items-center mb-6 relative border-4 border-white shadow-lg">
          {petData && (
            <img
              src={petData.getImagePath()}
              alt={petData.name}
              className="w-48 h-48 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
            />
          )}
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
          {petData?.name}
        </h1>
        <p className="text-indigo-500 font-semibold bg-indigo-50 px-4 py-1 rounded-full text-lg mb-4">
          Lv. {petData?.level}
        </p>
        {/* 경험치 바 */}
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-4 mb-1">
          <div
            className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((petData?.exp / petData?.getMaxExp()) * 100, 100)}%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-slate-400">
          EXP {petData?.exp} / {petData?.getMaxExp()}
        </p>
      </div>

      {/* 펫 스탯 텍스트 출력 영역 */}
      <div className="flex-1 w-full flex flex-col gap-6">
        <h3 className="text-xl font-bold border-b pb-2 text-slate-700">
          능력치 세부 정보
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <p className="text-emerald-700 text-sm font-semibold mb-1">
              생존 스탯
            </p>
            <p className="text-slate-600 font-medium">
              체력: {petData?.healthHp}/100
            </p>
            <p className="text-slate-600 font-medium">
              배고픔: {petData?.hunger}/100
            </p>
            <p className="text-slate-600 font-medium">
              청결도: {petData?.cleanliness}/100
            </p>
            <p className="text-slate-600 font-medium">
              스트레스: {petData?.stress}/100
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <p className="text-purple-700 text-sm font-semibold mb-1">
              감정 및 지능
            </p>
            <p className="text-slate-600 font-medium">
              지식: {petData?.knowledge}
            </p>
            <p className="text-slate-600 font-medium">
              애정: {petData?.affection}
            </p>
            <p className="text-slate-600 font-medium">
              공감력: {petData?.empathy}
            </p>
            <p className="text-slate-600 font-medium">
              논리력: {petData?.logic}
            </p>
            <p className="text-slate-600 font-medium">
              이타심: {petData?.altruism}
            </p>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-2">
          <p className="text-orange-700 font-semibold mb-1">
            현재 성향 (Tendency)
          </p>
          <p className="text-slate-700 font-bold text-lg uppercase">
            {petData?.tendency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetStatusPage;
