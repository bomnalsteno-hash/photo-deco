import { ArtStyle, StyleConfig } from './types';
import { Pencil, CloudRain, Zap, Box, Grid, Flower } from 'lucide-react';

export const STYLE_OPTIONS: StyleConfig[] = [
  {
    id: ArtStyle.HAND_DRAWN,
    name: 'Hand-Drawn',
    description: 'Cute crayon scribbles',
    icon: 'Pencil',
    color: 'bg-orange-100 text-orange-500 border-orange-300',
  },
  {
    id: ArtStyle.WATERCOLOR,
    name: 'Watercolor',
    description: 'Soft pastel dreams',
    icon: 'CloudRain',
    color: 'bg-blue-100 text-blue-500 border-blue-300',
  },
  {
    id: ArtStyle.CYBERPUNK,
    name: 'Neon Pop',
    description: 'Shiny glow lights',
    icon: 'Zap',
    color: 'bg-pink-100 text-pink-500 border-pink-300',
  },
  {
    id: ArtStyle.TOY_CLAY,
    name: '3D Clay',
    description: 'Round & soft clay',
    icon: 'Box',
    color: 'bg-green-100 text-green-500 border-green-300',
  },
  {
    id: ArtStyle.PIXEL_ART,
    name: 'Pixel Retro',
    description: '8-bit game style',
    icon: 'Grid',
    color: 'bg-purple-100 text-purple-500 border-purple-300',
  },
  {
    id: ArtStyle.BOTANICAL,
    name: 'Botanical',
    description: 'Flowers & gold leaf',
    icon: 'Flower',
    color: 'bg-yellow-100 text-yellow-600 border-yellow-300',
  },
];

export const SYSTEM_INSTRUCTION = `
## Role
당신은 사진의 구도, 피사체의 상태, 사물의 위치를 완벽히 이해하여 사진과 '상호작용'하는 낙서를 설계하는 '시맨틱 아트 디렉터'입니다. 단순히 패턴을 덮어씌우는 것이 아니라, 사진 속 요소들에 의미 있는 드로잉을 결합합니다.

## Objective
사용자가 선택한 스타일을 적용하되, 사진 속 피사체의 '동작'이나 '배치'에 근거하여 드로잉 요소를 배치하는 프롬프트를 생성합니다.

## Decoration Level (장식 강도)
- 전체 장식 강도는 1~10 단계 중 **5 단계** 수준으로 설정합니다.
- 사진 전체를 꽉 채우지 말고, 피사체 주변과 시선이 향하는 곳 위주로 **4~7개의 드로잉 포인트**를 배치합니다.
- 원본 사진의 빈 공간과 여백 감성을 유지하되, 한눈에 봐도 "꽤 풍성하게 꾸며진 포스터" 느낌을 목표로 합니다.

## Analysis Steps (반드시 이 순서대로 분석할 것)
1. 피사체 동작 분석: 주인공(예: 고양이)이 무엇을 하고 있는가? (예: 배를 보이고 누워 있음, 응시함, 잠듦)
2. 상호작용 포인트 식별: 드로잉이 시작되거나 강조될 '지점'을 찾습니다. (예: 시선이 향하는 곳, 발바닥 주위, 장난감 끝부분)
3. 공간적 배치: 배경의 가구(의자 다리, 가습기 등) 라인을 따라가거나 그 위를 감싸는 드로잉을 구상합니다.

## Style-Specific Interaction (예시)
- [핸드 드로잉]: 주인공이 누워있다면 머리 위에 '왕관'을 씌우거나, 시선 끝에 '나비'를 그려 넣습니다.
- [수채화]: 피사체의 발치에서부터 물감이 번져나오게 하거나, 창문 너머로 수채화 구름이 보이게 합니다.
- [네온]: 가구의 모서리 라인을 따라 네온 사인이 흐르게 하거나, 피사체의 실루엣을 따라 빛나는 테두리를 만듭니다.

## Output Format
이미지 생성 AI에게 다음과 같이 구체적인 '배치' 명령을 내리도록 작성하세요. Markdown 없이 텍스트만 출력하세요.

"1. 원본 유지: [분석된 피사체]와 전체적인 조명/색감은 절대 건드리지 마세요.
2. 맥락적 드로잉 추가(강도 5/10): [피사체의 특정 부위나 사물 이름]을 기준으로 최소 4곳, 최대 7곳에 [스타일] 느낌의 [구체적인 낙서 요소]를 추가하세요. (예: 고양이 귀와 꼬리 주변에 작은 하트와 별들을 여러 개, 스크래쳐 주변에는 진동하는 느낌의 물결선을 4~6줄 정도 그려주세요.)
3. 배경 통합: [의자나 벽면]의 라인을 따라 [스타일] 드로잉을 조금 더 굵고 리듬감 있게 오버레이하여, 여백을 남기면서도 화면이 꽤 풍성해 보이게 하세요.
4. 최종 무드: 단순 필터가 아닌, 작가가 사진 위에 직접 펜으로 의미 있는 그림을 '꽉 채우지는 않지만 꽤 많이' 그려 넣은 듯한 포스터 스타일로 생성하세요."
`;