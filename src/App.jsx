import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Heart, Droplets, Activity, Baby, Sparkles, Calendar, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Info, MessageCircle, Search, Download, Bell, ChevronRight, FlaskConical, Stethoscope, Pill, Scan, X, Clock, Dna, HeartPulse, Weight, Footprints, Shield } from 'lucide-react';

const App = () => {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const user = {
    name: 'Анна',
    firstName: 'Анна',
    currentWeek: 22,
    currentDay: 0,
    dueDate: '2 сентября 2026',
    conceptionType: 'ЭКО',
    transferDate: '16 декабря 2025',
    embryoDay: 5,
    bloodType: 'A(II) Rh+',
    age: 37,
  };

  const trimesters = [
    { id: 1, name: 'I триместр', weeks: '1–13 нед', color: '#a78bfa' },
    { id: 2, name: 'II триместр', weeks: '14–27 нед', color: '#fb7185' },
    { id: 3, name: 'III триместр', weeks: '28–40 нед', color: '#fbbf24' },
  ];

  const labData = {
    blood: [
      { name: 'Гемоглобин', key: 'hgb', t1: 127, t2: null, t3: null, normal: [110, 140], unit: 'г/л',
        description: 'Снижение гемоглобина при беременности — норма из-за увеличения объёма плазмы. Важен для доставки кислорода ребёнку. Твой результат — отличный.' },
      { name: 'Эритроциты', key: 'rbc', t1: 4.15, t2: null, t3: null, normal: [3.42, 4.55], unit: '×10¹²/л',
        description: 'Красные кровяные клетки. В норме.' },
      { name: 'Гематокрит', key: 'hct', t1: 38.8, t2: null, t3: null, normal: [31.0, 41.0], unit: '%',
        description: 'Соотношение клеток крови к плазме. В норме.' },
      { name: 'Лейкоциты', key: 'wbc', t1: 6.41, t2: null, t3: null, normal: [5.70, 13.60], unit: '×10⁹/л',
        description: 'Иммунные клетки. В норме.' },
      { name: 'Тромбоциты', key: 'plt', t1: 216, t2: null, t3: null, normal: [174, 391], unit: '×10⁹/л',
        description: 'Отвечают за свёртывание. В норме.' },
      { name: 'СОЭ', key: 'esr', t1: 8, t2: null, t3: null, normal: [4, 57], unit: 'мм/ч',
        description: 'Скорость оседания эритроцитов. При беременности может повышаться до 45 — у тебя пока низкая.' },
      { name: 'RDW (гетерогенность)', key: 'rdw', t1: 16.8, t2: null, t3: null, normal: [12.5, 14.1], unit: '%',
        description: 'Разброс размера эритроцитов. Слегка повышен (16.8 при норме до 14.1). Само по себе не критично, но в сочетании со снижением гемоглобина может указывать на железодефицит. Сейчас Hb в норме — повторить в динамике.' },
      { name: 'MCV (средний объём)', key: 'mcv', t1: 93.6, t2: null, t3: null, normal: [81.0, 96.0], unit: 'фл',
        description: 'Средний объём эритроцита. В норме.' },
    ],
    biochem: [
      { name: 'Глюкоза плазмы', key: 'glu', t1: 4.77, t2: null, t3: null, normal: [4.10, 6.10], unit: 'ммоль/л',
        description: 'Уровень сахара натощак (17.02). В норме. Контроль для исключения гестационного диабета — важно повторить ОГТТ на 24-28 нед.' },
      { name: 'HbA1c (гликир. гемоглобин)', key: 'hba1c', t1: null, t2: 5.0, t3: null, normal: [4.4, 6.0], unit: '%',
        description: 'Средний уровень сахара за последние 2-3 месяца (04.04). 5.0% — отличный показатель, гестационный диабет исключён.' },
      { name: 'Креатинин', key: 'cre', t1: 63, t2: null, t3: null, normal: [53, 97], unit: 'мкмоль/л',
        description: 'Показатель работы почек. В норме.' },
      { name: 'Мочевина', key: 'urea', t1: 3.05, t2: null, t3: null, normal: [2.10, 7.20], unit: 'ммоль/л',
        description: 'Конечный продукт распада белков. В норме.' },
      { name: 'Общий белок', key: 'tp', t1: 61.4, t2: null, t3: null, normal: [66.0, 83.0], unit: 'г/л',
        description: 'Снижен — 61.4 при норме 66-83. При беременности это физиологическая гемодилюция (увеличение объёма плазмы). Не патология, но обсуди с врачом, важно адекватное питание с белком.' },
      { name: 'Холестерин', key: 'chol', t1: 5.65, t2: null, t3: null, normal: [3.67, 5.46], unit: 'ммоль/л',
        description: 'Незначительно повышен (5.65 при норме до 5.46). При беременности холестерин физиологически растёт во всех триместрах — это норма для организма, который вынашивает ребёнка. Беспокоиться не стоит.' },
      { name: 'Билирубин общий', key: 'bil', t1: 9.50, t2: null, t3: null, normal: [3.40, 20.50], unit: 'мкмоль/л',
        description: 'Продукт распада гемоглобина. В норме.' },
      { name: 'АЛТ', key: 'alt', t1: 13, t2: null, t3: null, normal: [0, 35], unit: 'Ед/л',
        description: 'Печёночный фермент. В норме.' },
      { name: 'АСТ', key: 'ast', t1: 14, t2: null, t3: null, normal: [0, 35], unit: 'Ед/л',
        description: 'Печёночный фермент. В норме.' },
    ],
    hormones: [
      { name: 'ТТГ', key: 'tsh', t1: 1.327, t2: null, t3: null, normal: [0.100, 2.500], unit: 'мЕд/л',
        description: 'Тиреотропный гормон. Норма при беременности — до 2,5. У тебя 1.327 — отлично.' },
      { name: 'Антитела к ТПО', key: 'tpo', t1: 1, t2: null, t3: null, normal: [0, 10], unit: 'МЕ/мл',
        description: 'Антитела к тиреопероксидазе. Низкий уровень — норма. Аутоиммунного поражения щитовидной железы нет.' },
    ],
    vitamins: [
      { name: 'Железо (сывороточное)', key: 'fe', t1: 16.70, t2: null, t3: null, normal: [12.80, 25.60], unit: 'мкмоль/л',
        description: 'Сывороточное железо в норме (17.02). Однако ферритин — запасы железа — на 04.04 низковат (21.8). Контроль в динамике.' },
      { name: 'Ферритин', key: 'fer', t1: null, t2: 21.8, t3: null, normal: [10.0, 120.0], unit: 'мкг/л',
        description: 'Запасы железа в организме (04.04). Формально в норме лаборатории, но для беременности оптимум — выше 30. К 3 триместру может снизиться. Стоит обсудить с врачом приём препаратов железа в профилактической дозе.' },
      { name: 'Витамин B12', key: 'b12', t1: null, t2: 168.5, t3: null, normal: [148.0, 664.0], unit: 'пмоль/л',
        description: 'На нижней границе нормы (148-664), у тебя 168.5. Важен для нервной системы плода и кроветворения. Можно обсудить с врачом приём B12-содержащих витаминов для беременных.' },
      { name: 'Цинк', key: 'zn', t1: null, t2: 9.50, t3: null, normal: [10.70, 17.50], unit: 'мкмоль/л',
        description: 'СНИЖЕН (9.50 при норме 10.70+). При беременности дефицит цинка ассоциирован с риском низкого веса при рождении и преждевременных родов. С учётом высокого риска ПР (1:37) — обсудить с врачом коррекцию.' },
      { name: 'Йод', key: 'iod', t1: null, t2: 43.4, t3: null, normal: [26.7, 67.3], unit: 'мкг/л',
        description: 'В норме (04.04). Важен для синтеза гормонов щитовидной железы у мамы и для развития мозга плода.' },
      { name: 'Селен', key: 'se', t1: null, t2: 136.9, t3: null, normal: [58.0, 234.0], unit: 'мкг/л',
        description: 'В норме (04.04). Селен — антиоксидант, поддерживает иммунитет и работу щитовидной железы.' },
    ],
    urine: [
      { name: 'Цвет', key: 'urcolor', t1: 'жёлтый', t2: 'светло-жёлтый', t3: null, normal: 'жёлтый', unit: '', isText: true,
        description: 'Цвет мочи. В норме на обеих датах (17.02 и 04.04). Светло-жёлтый — признак хорошей гидратации.' },
      { name: 'Прозрачность', key: 'urclear', t1: 'полная', t2: 'полная', t3: null, normal: 'полная', unit: '', isText: true,
        description: 'Прозрачность. В норме на обеих датах.' },
      { name: 'Плотность', key: 'urdens', t1: 1.013, t2: 1.010, t3: null, normal: [1.005, 1.035], unit: 'г/мл',
        description: 'Относительная плотность. В норме на обеих датах. Лёгкое снижение к 04.04 — признак достаточного питья.' },
      { name: 'pH мочи', key: 'urph', t1: 7.0, t2: 7.0, t3: null, normal: [5.0, 8.0], unit: '',
        description: 'Кислотность мочи. В норме на обеих датах.' },
      { name: 'Белок', key: 'urprot', t1: 0.0, t2: 0.0, t3: null, normal: [0.0, 0.1], unit: 'г/л',
        description: 'Белок в моче. Отсутствует на обеих датах — отлично. Один из ключевых маркеров преэклампсии.' },
      { name: 'Глюкоза', key: 'urglu', t1: 0.0, t2: 0.0, t3: null, normal: [0.0, 0.8], unit: 'ммоль/л',
        description: 'Глюкоза в моче. Отсутствует на обеих датах. Маркер диабета.' },
      { name: 'Лейкоциты', key: 'urleu', t1: '1-2', t2: '1-2', t3: null, normal: '0-5', unit: 'в п/зр', isText: true,
        description: '1-2 в поле зрения. В норме на обеих датах (17.02 и 04.04).' },
      { name: 'Бактерии', key: 'urbac', t1: 'нет', t2: 'нет', t3: null, normal: 'нет', unit: '', isText: true,
        description: 'Бактерии не обнаружены ни на одной дате. Посев мочи (28.02) — роста микрофлоры не выявлено.' },
    ],
  };

  // ГЕНЕТИКА — реальные данные I скрининга и инфекций
  const geneticsData = {
    // Биохимические маркеры I скрининга (16.02.2026)
    firstScreening: {
      week: '12 нед 1 день',
      date: '16 февраля 2026',
      lab: 'Медико-генетический центр · Life Cycle',
      doctor: '—',
      markers: [
        { name: 'PAPP-A', value: 2113.1, unit: 'мМЕ/л', mom: 1.16, normalMoM: [0.5, 2.0], status: 'normal',
          description: 'Ассоциированный с беременностью плазменный белок A. Низкий уровень — маркер риска синдрома Дауна. У тебя в норме.' },
        { name: 'β-ХГЧ', value: 72.9, unit: 'нг/мл', mom: 1.43, normalMoM: [0.5, 2.0], status: 'normal',
          description: 'Хорионический гонадотропин. Изменения связаны с хромосомными патологиями. MoM в пределах нормы.' },
        { name: 'PlGF (плацент. фактор роста)', value: 21.81, unit: 'пг/мл', mom: 0.76, normalMoM: [0.5, 2.0], status: 'normal',
          description: 'Маркер сосудистого развития плаценты. Используется для расчёта риска преэклампсии.' },
        { name: 'ТВП (УЗИ-маркер)', value: 1.0, unit: 'мм', mom: 0.67, normalMoM: [null, 2.5], status: 'normal',
          description: 'Толщина воротникового пространства. Отлично — значительно ниже порога 2.5 мм.' },
        { name: 'Маточные артерии (ПИ)', value: '1.43 / 1.49', unit: '', mom: null, normalMoM: null, status: 'normal',
          description: 'Допплерометрия маточных артерий — лев./прав. ПИ в норме для срока.' },
      ],
    },
    // Хромосомные риски — реальные результаты
    chromosomalRisks: [
      { name: 'Синдром Дауна (Т21)', baseRisk: '1:278', adjustedRisk: '1:11 750', biochemOnly: '1:627', status: 'normal',
        description: 'Возрастной риск 1:278 после комбинированного скрининга снижен до 1:11 750. Низкий.' },
      { name: 'Синдром Эдвардса (Т18)', baseRisk: '1:100 000', adjustedRisk: '1:100 000', biochemOnly: null, status: 'normal',
        description: 'Тяжёлая хромосомная патология. Риск минимальный.' },
      { name: 'Синдром Патау (Т13)', baseRisk: '1:100 000', adjustedRisk: '1:100 000', biochemOnly: null, status: 'normal',
        description: 'Очень редкая хромосомная патология. Риск минимальный.' },
      { name: 'Синдром Тёрнера', baseRisk: '1:100 000', adjustedRisk: '1:100 000', biochemOnly: null, status: 'normal',
        description: 'Моносомия X. Риск минимальный.' },
    ],
    // Акушерские риски — Pre-eclampsia Predictor
    obstetricRisks: [
      { name: 'Преждевременные роды', value: '1:37', threshold: '1:100', status: 'high',
        description: 'ВЫСОКИЙ риск. Рекомендована консультация акушера-гинеколога для тактики ведения. Важно: на II скрининге шейка 43 мм и зев закрыт — это хороший признак, но контроль шейки нужен в динамике.' },
      { name: 'Задержка роста плода (ЗРП)', value: '1:480', threshold: '1:100', status: 'normal',
        description: 'Низкий риск. Однако на II скрининге плод опережает срок — наблюдение в динамике.' },
      { name: 'Ранняя преэклампсия', value: '1:11 861', threshold: '1:100', status: 'normal',
        description: 'Очень низкий риск ранней (до 34 нед) преэклампсии.' },
      { name: 'Поздняя преэклампсия', value: '1:374', threshold: '1:100', status: 'normal',
        description: 'Низкий риск поздней преэклампсии.' },
    ],
    // Инфекции — Инвитро 11.12.2025
    infections: {
      date: '11 декабря 2025',
      lab: 'Лаборатория',
      tests: [
        { name: 'ВИЧ 1/2 (антитела + p24)', result: 'отрицательный', ok: true },
        { name: 'HBsAg (гепатит B)', result: 'отрицательный', ok: true },
        { name: 'anti-HCV (гепатит C)', result: 'отрицательный', ok: true },
        { name: 'Сифилис (anti-Tr.pallidum IgG+IgM)', result: 'отрицательный', ok: true },
        { name: 'Сифилис RPR', result: 'отрицательный', ok: true },
      ],
    },
  };

  // МОНИТОРИНГ — давление, вес, отёки по неделям
  const monitoringData = {
    // Замеры по неделям (от начала беременности до текущей)
    weekly: [
      { week: 6, sys: 115, dia: 72, weight: 59.5, edema: 0, pulse: 72, note: 'Постановка на учёт · декабрь 2025' },
      { week: 8, sys: 112, dia: 70, weight: 59.7, edema: 0, pulse: 74 },
      { week: 10, sys: 110, dia: 68, weight: 60.2, edema: 0, pulse: 76 },
      { week: 12, sys: 108, dia: 68, weight: 60.8, edema: 0, pulse: 78, note: 'I скрининг · КТР 57 мм' },
      { week: 14, sys: 110, dia: 70, weight: 61.4, edema: 0, pulse: 78 },
      { week: 16, sys: 112, dia: 70, weight: 62.2, edema: 0, pulse: 80 },
      { week: 18, sys: 115, dia: 72, weight: 63.0, edema: 1, pulse: 82, note: 'II скрининг · 04.04.2026' },
      { week: 20, sys: 118, dia: 74, weight: 63.8, edema: 1, pulse: 82 },
      { week: 22, sys: 118, dia: 75, weight: 64.5, edema: 1, pulse: 84, note: 'Текущая неделя' },
    ],
    targets: {
      sys: [90, 130],
      dia: [60, 85],
      pulse: [60, 100],
      weightGainTotal: [11.5, 16], // кг за всю беременность для нормального ИМТ
      currentExpectedGain: [4.5, 6.5], // кг к 22 неделе
    },
    startWeight: 59.5,
    height: 173, // см
    bmiPrePregnancy: 19.9, // 59.5 / (1.73^2)
    bmiCategory: 'Нормальный вес',
  };

  const ultrasounds = [
    {
      id: 1, name: 'I скрининг', week: '12 нед 1 день', date: '16 февраля 2026', status: 'completed',
      lab: 'УЗИ-кабинет',
      findings: [
        { label: 'КТР (копчико-теменной размер)', value: '57 мм', normal: 'Соотв. сроку 12+1', ok: true },
        { label: 'ТВП (толщина воротник. простр.)', value: '1.0 мм', normal: '< 2.5 мм · MoM 0.67', ok: true },
        { label: 'Носовая кость', value: 'Присутствует', normal: 'Норма', ok: true },
        { label: 'β-ХГЧ', value: '72.9 нг/мл (MoM 1.43)', normal: 'MoM 0.5–2.0', ok: true },
        { label: 'PAPP-A', value: '2113.1 мМЕ/л (MoM 1.16)', normal: 'MoM 0.5–2.0', ok: true },
        { label: 'PlGF', value: '21.81 пг/мл (MoM 0.76)', normal: 'MoM 0.5–2.0', ok: true },
        { label: 'Маточные арт. (ПИ)', value: 'Лев. 1.43 / Прав. 1.49', normal: 'Норма для срока', ok: true },
        { label: 'АД (правая рука)', value: '108/73, 101/70', normal: '90–130 / 60–85', ok: true },
        { label: 'АД (левая рука)', value: '103/71, 103/67', normal: '90–130 / 60–85', ok: true },
        { label: 'Вес', value: '61 кг', normal: 'Старт 59.5 кг', ok: true },
        { label: 'Риск преждевременных родов', value: '1:37', normal: 'Порог 1:100', ok: false, warning: true },
        { label: 'Риск с-ма Дауна', value: '1:11 750', normal: 'Базовый 1:278', ok: true },
      ],
      conclusion: 'Беременность 12 нед 1 день. ВРТ (ЭКО). По биохимии и УЗИ-маркерам — все хромосомные риски низкие (Дауна 1:11 750 при базовом 1:278). По акушерским рискам выявлен высокий риск преждевременных родов (1:37) — рекомендована консультация акушера-гинеколога. Расчётная дата родов: 30.08.2026.',
      doctor: '—',
    },
    {
      id: 2, name: 'II скрининг', week: '18 нед 2 дня', date: '4 апреля 2026', status: 'completed',
      lab: 'УЗИ-кабинет',
      findings: [
        { label: 'БПР (бипариетальный размер)', value: '45 мм', normal: '19 6/7 нед · 96‰', ok: true },
        { label: 'ОГ (окружность головы)', value: '167 мм', normal: '19 3/7 нед · 88‰', ok: true },
        { label: 'ОЖ (окружность живота)', value: '147 мм', normal: '20 0/7 нед · 92‰', ok: true },
        { label: 'ДБ (длина бедра)', value: '30 мм', normal: '19 3/7 нед · 84‰', ok: true },
        { label: 'ДП (длина плеча)', value: '29 мм', normal: '19 3/7 нед · 90‰', ok: true },
        { label: 'Носовая кость', value: '5,0 мм', normal: 'Визуализируется', ok: true },
        { label: 'Мозжечок', value: '19 мм (66‰)', normal: '18 4/7 нед', ok: true },
        { label: 'Большая цистерна', value: '4,1 мм', normal: '< 10 мм', ok: true },
        { label: 'ЧСС плода', value: '150 уд/мин', normal: '120–180', ok: true },
        { label: 'Плацента', value: 'По передней стенке, 22 мм', normal: 'Соотв. сроку', ok: true },
        { label: 'От внутр. зева', value: '35 мм', normal: '> 20 мм', ok: true },
        { label: 'Шейка матки', value: '43 мм, зев закрыт', normal: '> 25 мм', ok: true },
        { label: 'ИАЖ (околоплодные воды)', value: '150 мм', normal: '80–180 мм', ok: true },
        { label: 'МВК', value: '54 мм', normal: 'Норма', ok: true },
        { label: 'Маточные артерии (ПИ)', value: '0,73 / 0,84', normal: 'N', ok: true },
        { label: 'Артерия пуповины (ПИ)', value: '1,12', normal: 'N', ok: true },
        { label: 'Предполагаемая масса', value: '309 ± 45 г', normal: '98‰ — крупный', ok: true, warning: true },
        { label: 'Предлежание', value: 'Тазовое', normal: 'На сроке норма', ok: true },
      ],
      conclusion: 'Беременность 18 нед 2 дня (по дате эмбриотрансфера). Анатомия плода без особенностей, пороков и аномалий не выявлено. Размеры опережают срок по ПЭ примерно на 1,5 нед — рекомендовано УЗИ в динамике.',
      doctor: '—',
    },
    {
      id: 3, name: 'III скрининг', week: '30–34 нед', date: 'Запланировано: июль 2026', status: 'upcoming',
      findings: [], conclusion: 'Скрининг ещё не проводился', doctor: '',
    },
  ];

  const getStatus = (value, normal, isText) => {
    if (isText) return 'normal';
    if (Array.isArray(normal)) {
      const [min, max] = normal;
      const range = max - min;
      const buffer = range * 0.05;
      if (value < min - buffer) return 'low';
      if (value > max + buffer) return 'high';
      if (value < min || value > max) return 'borderline';
      return 'normal';
    }
    return 'normal';
  };

  const statusConfig = {
    normal: { color: '#10b981', bg: '#ecfdf5', label: 'Норма', icon: CheckCircle2 },
    low: { color: '#6366f1', bg: '#eef2ff', label: 'Понижен', icon: TrendingDown },
    high: { color: '#ef4444', bg: '#fef2f2', label: 'Повышен', icon: TrendingUp },
    borderline: { color: '#f59e0b', bg: '#fffbeb', label: 'На границе', icon: AlertTriangle },
  };

  // Возвращает последнее доступное значение и предыдущее
  const getLatestValues = (item) => {
    if (item.t3 !== null && item.t3 !== undefined) return { current: item.t3, previous: item.t2, currentLabel: 'III тр', currentDate: '—' };
    if (item.t2 !== null && item.t2 !== undefined) return { current: item.t2, previous: item.t1, currentLabel: 'II тр', currentDate: '04.04.2026' };
    return { current: item.t1, previous: null, currentLabel: 'I тр', currentDate: '17.02.2026' };
  };

  const getMetricsForCategory = (categoryKey) => {
    const items = labData[categoryKey] || [];
    return items.map((item) => {
      const trendAll = [
        { week: 12, value: item.t1, label: 'I тр' },
        { week: 20, value: item.t2, label: 'II тр' },
        { week: 28, value: item.t3, label: 'III тр' },
      ];
      const trend = trendAll.filter((p) => p.value !== null && p.value !== undefined);
      const { current, previous, currentLabel } = getLatestValues(item);
      const change = (previous !== null && previous !== undefined && typeof current === 'number' && typeof previous === 'number')
        ? ((current - previous) / previous) * 100 : 0;
      return { ...item, current, previous, currentLabel, trend, change, status: getStatus(current, item.normal, item.isText) };
    });
  };

  const healthIndex = useMemo(() => {
    let normalCount = 0;
    let total = 0;
    Object.values(labData).forEach((arr) => {
      arr.forEach((item) => {
        const { current } = getLatestValues(item);
        const status = getStatus(current, item.normal, item.isText);
        total++;
        if (status === 'normal') normalCount++;
        else if (status === 'borderline') normalCount += 0.7;
        else normalCount += 0.4;
      });
    });
    return total > 0 ? Math.round((normalCount / total) * 100) : 100;
  }, []);

  const categories = [
    { id: 'overview', name: 'Обзор', icon: Heart },
    { id: 'monitoring', name: 'Мониторинг', icon: HeartPulse },
    { id: 'genetics', name: 'Генетика', icon: Dna },
    { id: 'ultrasound', name: 'УЗИ', icon: Scan },
    { id: 'blood', name: 'Кровь', icon: Droplets },
    { id: 'biochem', name: 'Биохимия', icon: FlaskConical },
    { id: 'hormones', name: 'Гормоны', icon: Activity },
    { id: 'vitamins', name: 'Витамины', icon: Pill },
    { id: 'urine', name: 'Моча', icon: FlaskConical },
  ];

  const progressPercent = Math.round((user.currentWeek / 40) * 100);
  const currentTrimester = user.currentWeek <= 13 ? 1 : user.currentWeek <= 27 ? 2 : 3;

  const alerts = useMemo(() => {
    const result = [];
    Object.entries(labData).forEach(([catKey, items]) => {
      items.forEach((item) => {
        const { current } = getLatestValues(item);
        const status = getStatus(current, item.normal, item.isText);
        if (status !== 'normal') {
          result.push({
            metric: item.name, value: current, unit: item.unit,
            normal: item.normal, status, category: catKey,
          });
        }
      });
    });
    return result;
  }, []);

  const generateClaudePrompt = () => {
    const issues = alerts.map((a) => {
      const normalStr = Array.isArray(a.normal) ? `${a.normal[0]}–${a.normal[1]}` : a.normal;
      return `${a.metric}: ${a.value} ${a.unit} (норма: ${normalStr})`;
    }).join('\n');
    const text = `Я на ${user.currentWeek} неделе беременности (ЭКО, 37 лет). Вот мои показатели вне нормы:\n\n${issues || 'Все показатели в норме.'}\n\nКроме того: высокий риск преждевременных родов (1:37 при пороге 1:100) по комбинированному скринингу.\n\nЧто это значит и на что обратить внимание?`;
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    alert('Промт скопирован в буфер обмена. Открой Claude и вставь его в чат.');
  };

  const filteredMetrics = useMemo(() => {
    if (['overview', 'ultrasound', 'genetics', 'monitoring'].includes(activeCategory)) return [];
    const metrics = getMetricsForCategory(activeCategory);
    if (!searchQuery) return metrics;
    return metrics.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen" style={{
      fontFamily: '"Fraunces", "Inter", system-ui, sans-serif',
      background: 'linear-gradient(135deg, #fef7f4 0%, #fdf4ff 50%, #f0f9ff 100%)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes float-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes draw-circle { from { stroke-dashoffset: 565; } }
        .stagger-item { animation: float-up 0.5s ease-out backwards; }
        .display-font { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .body-font { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{
          background: 'radial-gradient(ellipse at top left, #fbcfe8 0%, transparent 50%), radial-gradient(ellipse at top right, #ddd6fe 0%, transparent 50%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #f9a8d4 0%, #c4b5fd 100%)' }}>
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 body-font">Дашборд беременности</div>
                <div className="flex items-baseline gap-2">
                  <div className="display-font text-lg font-semibold text-stone-800">{user.name}</div>
                  <div className="body-font text-xs text-stone-500">· {user.age} лет</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-full hover:bg-white/60 transition-colors"><Bell className="w-4 h-4 text-stone-600" /></button>
              <button className="p-2.5 rounded-full hover:bg-white/60 transition-colors"><Download className="w-4 h-4 text-stone-600" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8"
                 style={{
                   background: 'linear-gradient(135deg, #fef3f2 0%, #fef0f5 50%, #f5f3ff 100%)',
                   boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 20px 60px -20px rgba(244,114,182,0.25)',
                 }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest text-rose-500/80 body-font font-medium">Срок беременности</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider body-font font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #c4b5fd, #f9a8d4)' }}>
                      ЭКО
                    </span>
                  </div>
                  <div className="display-font text-6xl font-light text-stone-800 leading-none">
                    {user.currentWeek}<span className="text-3xl text-stone-500 ml-2 italic">нед</span>
                    <span className="text-3xl text-stone-400 ml-2">{user.currentDay}<span className="text-2xl italic ml-1">дн</span></span>
                  </div>
                  <div className="mt-3 body-font text-sm text-stone-600">
                    ПДР: <span className="font-semibold text-stone-800">{user.dueDate}</span> · до родов <span className="font-semibold text-stone-800">{40 - user.currentWeek} нед</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 body-font text-xs text-stone-500">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span>Перенос 5-дневного эмбриона · {user.transferDate}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur">
                  <Baby className="w-4 h-4" style={{ color: trimesters[currentTrimester - 1].color }} />
                  <span className="display-font text-sm font-semibold text-stone-700">{trimesters[currentTrimester - 1].name}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative h-3 rounded-full overflow-hidden bg-white/60">
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                       style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #c4b5fd 0%, #f9a8d4 50%, #fcd34d 100%)' }} />
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-wider body-font text-stone-500">
                  <span>1 нед</span><span>13</span><span>27</span><span>40 нед</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-7 bg-white/70 backdrop-blur-sm"
                 style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 20px 60px -20px rgba(167,139,250,0.2)' }}>
              <div className="text-xs uppercase tracking-widest text-stone-500 body-font font-medium mb-3">Индекс здоровья</div>
              <div className="flex items-center gap-5">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f9a8d4" />
                        <stop offset="50%" stopColor="#c4b5fd" />
                        <stop offset="100%" stopColor="#67e8f9" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="90" stroke="#f5f5f4" strokeWidth="14" fill="none" />
                    <circle cx="100" cy="100" r="90" stroke="url(#ringGrad)" strokeWidth="14" fill="none"
                            strokeLinecap="round" strokeDasharray={`${(healthIndex / 100) * 565} 565`}
                            style={{ animation: 'draw-circle 1.2s ease-out' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="display-font text-3xl font-semibold text-stone-800">{healthIndex}</div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 body-font">из 100</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="display-font text-base font-semibold text-stone-800 leading-tight mb-1">
                    {healthIndex >= 85 ? 'Отлично' : healthIndex >= 70 ? 'Хорошо' : 'Внимание'}
                  </div>
                  <div className="body-font text-xs text-stone-500 leading-relaxed">
                    {alerts.length > 0 ? `${alerts.length} ${alerts.length === 1 ? 'показатель отклоняется' : 'показателей вне нормы'}` : 'Все показатели в норме'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all body-font text-sm ${isActive ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeCategory === 'overview' && (
          <div className="space-y-8">
            {alerts.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="display-font text-2xl font-semibold text-stone-800">На что обратить внимание</h2>
                  <span className="body-font text-sm text-stone-500">{alerts.length} {alerts.length === 1 ? 'отклонение' : 'отклонений'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alerts.slice(0, 6).map((alert, idx) => {
                    const cfg = statusConfig[alert.status];
                    const Icon = cfg.icon;
                    return (
                      <div key={idx} className="stagger-item rounded-2xl p-5 bg-white border border-stone-200/70"
                           style={{ animationDelay: `${idx * 60}ms`, boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
                            <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs uppercase tracking-wider body-font font-medium" style={{ color: cfg.color }}>{cfg.label}</div>
                            <div className="display-font text-base font-semibold text-stone-800 mt-0.5 truncate">{alert.metric}</div>
                            <div className="body-font text-sm text-stone-500 mt-1">
                              {alert.value} {alert.unit} · норма {Array.isArray(alert.normal) ? `${alert.normal[0]}–${alert.normal[1]}` : alert.normal}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="relative overflow-hidden rounded-3xl p-8"
                 style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #831843 100%)', boxShadow: '0 30px 60px -20px rgba(76,29,149,0.4)' }}>
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-3xl"
                   style={{ background: 'radial-gradient(circle, #f9a8d4 0%, transparent 70%)' }} />
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-pink-200" />
                    <span className="text-xs uppercase tracking-widest text-pink-200 body-font font-medium">Помощник</span>
                  </div>
                  <h3 className="display-font text-3xl font-semibold text-white leading-tight mb-2">Обсудить результаты с Claude</h3>
                  <p className="body-font text-white/70 leading-relaxed">
                    Соберём все отклонения и подготовим персональный вопрос — ты сможешь обсудить их с Claude или показать врачу.
                  </p>
                </div>
                <button onClick={generateClaudePrompt}
                        className="group flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-stone-900 hover:bg-stone-50 transition-all body-font font-semibold text-sm shadow-xl">
                  <MessageCircle className="w-4 h-4" />
                  Скопировать запрос
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="display-font text-2xl font-semibold text-stone-800 mb-4">Динамика по триместрам</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trimesters.map((tri) => {
                  const isCurrent = currentTrimester === tri.id;
                  const isPast = currentTrimester > tri.id;
                  return (
                    <div key={tri.id}
                         className={`relative overflow-hidden rounded-2xl p-6 border transition-all ${isCurrent ? 'border-stone-900 shadow-lg' : 'border-stone-200/70 bg-white/70'}`}
                         style={{ background: isCurrent ? `linear-gradient(135deg, ${tri.color}15 0%, ${tri.color}05 100%)` : undefined }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="display-font text-xl font-semibold text-stone-800">{tri.name}</div>
                        {isCurrent && <span className="text-[10px] uppercase tracking-widest font-bold body-font px-2 py-1 rounded-full" style={{ backgroundColor: tri.color, color: 'white' }}>Сейчас</span>}
                        {isPast && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      </div>
                      <div className="body-font text-sm text-stone-500">{tri.weeks}</div>
                      <div className="mt-4 h-1.5 rounded-full overflow-hidden bg-stone-100">
                        <div className="h-full rounded-full" style={{ width: isPast ? '100%' : isCurrent ? '50%' : '0%', backgroundColor: tri.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'ultrasound' && (
          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <h2 className="display-font text-3xl font-semibold text-stone-800">Скрининги УЗИ</h2>
              <span className="body-font text-sm text-stone-500">3 исследования</span>
            </div>
            {ultrasounds.map((u, idx) => (
              <div key={u.id} className="stagger-item relative overflow-hidden rounded-3xl bg-white border border-stone-200/70"
                   style={{ animationDelay: `${idx * 80}ms`, boxShadow: '0 10px 40px -15px rgba(0,0,0,0.08)', opacity: u.status === 'upcoming' ? 0.7 : 1 }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  <div className="md:col-span-1 p-7 border-r border-stone-200/70"
                       style={{ background: u.status === 'completed' ? 'linear-gradient(135deg, #fef0f5 0%, #f5f3ff 100%)' : 'linear-gradient(135deg, #f5f5f4 0%, #fafaf9 100%)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                           style={{ background: u.status === 'completed' ? 'linear-gradient(135deg, #f9a8d4, #c4b5fd)' : '#e7e5e4' }}>
                        <Scan className="w-4 h-4 text-white" />
                      </div>
                      {u.status === 'upcoming' && <span className="text-[10px] uppercase tracking-wider body-font font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700">Запланировано</span>}
                      {u.status === 'completed' && <span className="text-[10px] uppercase tracking-wider body-font font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Выполнено</span>}
                    </div>
                    <div className="display-font text-3xl font-semibold text-stone-800 leading-tight">{u.name}</div>
                    <div className="display-font text-lg italic text-stone-500 mt-1">{u.week}</div>
                    <div className="mt-5 flex items-center gap-2 body-font text-sm text-stone-600">
                      <Calendar className="w-4 h-4" /><span>{u.date}</span>
                    </div>
                    {u.doctor && u.doctor !== '—' && (
                      <div className="mt-1 flex items-center gap-2 body-font text-sm text-stone-500">
                        <Stethoscope className="w-4 h-4" /><span>{u.doctor}</span>
                      </div>
                    )}
                    {u.lab && (
                      <div className="mt-1 flex items-center gap-2 body-font text-xs text-stone-400">
                        <FlaskConical className="w-3.5 h-3.5" /><span>{u.lab}</span>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 p-7">
                    {u.status === 'completed' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-5">
                          {u.findings.map((f, i) => (
                            <div key={i} className={`flex items-start justify-between gap-3 py-2 ${
                              f.highlight ? 'col-span-full p-3 rounded-xl' :
                              f.warning ? 'p-2.5 rounded-lg' :
                              'border-b border-stone-100'
                            }`}
                                 style={
                                   f.highlight ? { background: 'linear-gradient(90deg, #fdf2f8, #f5f3ff)' } :
                                   f.warning ? { background: '#fffbeb', border: '1px solid #fde68a' } :
                                   {}
                                 }>
                              <div className="flex-1 min-w-0">
                                <div className="body-font text-xs text-stone-500">{f.label}</div>
                                <div className={`body-font text-sm font-semibold mt-0.5 ${
                                  f.highlight ? 'display-font text-xl text-pink-600' :
                                  f.warning ? 'text-amber-700' :
                                  'text-stone-800'
                                }`}>{f.value}</div>
                              </div>
                              {!f.highlight && (
                                <div className="text-right flex-shrink-0">
                                  <div className={`body-font text-[10px] uppercase tracking-wider ${f.warning ? 'text-amber-500' : 'text-stone-400'}`}>
                                    {f.warning ? 'внимание' : 'норма'}
                                  </div>
                                  <div className={`body-font text-xs mt-0.5 ${f.warning ? 'text-amber-700' : 'text-stone-500'}`}>{f.normal}</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl p-4 bg-stone-50 border border-stone-100">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[10px] uppercase tracking-widest body-font font-bold text-stone-500 mb-1">Заключение</div>
                              <p className="body-font text-sm text-stone-700 leading-relaxed">{u.conclusion}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[200px]">
                        <div className="text-center max-w-sm">
                          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-stone-400" />
                          </div>
                          <div className="display-font text-lg font-semibold text-stone-700 mb-1">Ждём встречи</div>
                          <p className="body-font text-sm text-stone-500">Третий скрининг покажет, как развивается малыш и готов ли организм к родам.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ГЕНЕТИКА */}
        {activeCategory === 'genetics' && (
          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="display-font text-3xl font-semibold text-stone-800">Генетика и риски</h2>
                <p className="body-font text-sm text-stone-500 mt-1">Скрининги, оценка рисков и инфекционный статус · базовые риски рассчитаны для возраста {user.age}</p>
              </div>
              <span className="body-font text-sm text-stone-500">4 раздела</span>
            </div>

            {/* ⚠️ ВАЖНОЕ — высокий риск преждевременных родов */}
            <div className="stagger-item relative overflow-hidden rounded-3xl p-6 border-2"
                 style={{
                   background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                   borderColor: '#f59e0b',
                   boxShadow: '0 10px 40px -15px rgba(245,158,11,0.3)',
                 }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest body-font font-bold text-amber-700 mb-1">Требует внимания</div>
                  <div className="display-font text-xl font-semibold text-stone-800 mb-2">Высокий риск преждевременных родов: 1:37</div>
                  <p className="body-font text-sm text-stone-700 leading-relaxed">
                    По данным комбинированного скрининга от 16.02.2026 (программа Pre-eclampsia Predictor) расчётный риск преждевременных родов — 1:37 при пороге 1:100. Лаборатория рекомендовала консультацию акушера-гинеколога.
                    <span className="block mt-2 text-stone-600">
                      💡 На II скрининге (04.04.2026) шейка матки 43 мм, внутренний зев закрыт — это благоприятный признак. Важно продолжать мониторинг шейки в динамике.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* I СКРИНИНГ — биохимия */}
            <div className="stagger-item rounded-3xl bg-white border border-stone-200/70 p-7"
                 style={{ animationDelay: '80ms', boxShadow: '0 10px 40px -15px rgba(0,0,0,0.08)' }}>
              <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
                <div>
                  <div className="display-font text-2xl font-semibold text-stone-800">Биохимия I скрининга</div>
                  <div className="body-font text-sm text-stone-500 mt-0.5">{geneticsData.firstScreening.week} · {geneticsData.firstScreening.date}</div>
                  <div className="body-font text-xs text-stone-400 mt-0.5">{geneticsData.firstScreening.lab} · {geneticsData.firstScreening.doctor}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wider body-font font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  Все маркеры в норме
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {geneticsData.firstScreening.markers.map((m, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-stone-200/70"
                       style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f5f3ff 100%)' }}>
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="display-font text-base font-semibold text-stone-800 leading-tight">{m.name}</div>
                      <span className="text-[10px] uppercase tracking-wider body-font font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
                        Норма
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="display-font text-2xl font-semibold text-stone-800">{m.value}</span>
                      <span className="body-font text-xs text-stone-500">{m.unit}</span>
                    </div>
                    {m.mom !== null && (
                      <div className="body-font text-xs text-stone-600">
                        MoM: <span className="font-semibold">{m.mom}</span>
                        {Array.isArray(m.normalMoM) && m.normalMoM[0] !== null && (
                          <span className="text-stone-400"> (норма {m.normalMoM[0]}–{m.normalMoM[1]})</span>
                        )}
                        {Array.isArray(m.normalMoM) && m.normalMoM[0] === null && (
                          <span className="text-stone-400"> (норма &lt; {m.normalMoM[1]})</span>
                        )}
                      </div>
                    )}
                    <p className="body-font text-xs text-stone-500 mt-2 leading-relaxed">{m.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <div className="body-font text-xs text-stone-600 leading-relaxed">
                    <span className="font-semibold text-stone-800">MoM (Multiple of Median)</span> — отклонение от медианы для срока. Норма 0,5–2,0. КТР 57 мм, носовая кость присутствует, ТВП всего 1.0 мм — все ультразвуковые маркеры отличные.
                  </div>
                </div>
              </div>
            </div>

            {/* ХРОМОСОМНЫЕ РИСКИ */}
            <div className="stagger-item" style={{ animationDelay: '160ms' }}>
              <h3 className="display-font text-xl font-semibold text-stone-800 mb-1">Хромосомные риски</h3>
              <p className="body-font text-sm text-stone-500 mb-4">Базовый риск по возрасту → расчётный после комбинированного скрининга</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {geneticsData.chromosomalRisks.map((r, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-stone-200/70"
                       style={{ boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="display-font text-base font-semibold text-stone-800 leading-tight">{r.name}</div>
                      <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="body-font text-[10px] uppercase tracking-wider text-stone-400">Возрастной</div>
                        <div className="display-font text-sm text-stone-500 line-through">{r.baseRisk}</div>
                      </div>
                      <div>
                        <div className="body-font text-[10px] uppercase tracking-wider text-stone-400">После скрининга</div>
                        <div className="display-font text-xl font-semibold text-emerald-600">{r.adjustedRisk}</div>
                      </div>
                    </div>
                    {r.biochemOnly && (
                      <div className="mt-2 body-font text-[11px] text-stone-500">
                        Только биохимия: <span className="font-semibold">{r.biochemOnly}</span>
                      </div>
                    )}
                    <p className="body-font text-xs text-stone-500 mt-3 leading-relaxed">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* АКУШЕРСКИЕ РИСКИ */}
            <div className="stagger-item" style={{ animationDelay: '240ms' }}>
              <h3 className="display-font text-xl font-semibold text-stone-800 mb-1">Акушерские риски</h3>
              <p className="body-font text-sm text-stone-500 mb-4">Pre-eclampsia Predictor · порог тревоги 1:100</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {geneticsData.obstetricRisks.map((r, i) => {
                  const isHigh = r.status === 'high';
                  return (
                    <div key={i} className="p-5 rounded-2xl border-2"
                         style={{
                           background: isHigh ? 'linear-gradient(135deg, #fef3c7 0%, white 100%)' : 'white',
                           borderColor: isHigh ? '#fbbf24' : '#e7e5e4',
                           boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)',
                         }}>
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <div className="display-font text-base font-semibold text-stone-800 leading-tight">{r.name}</div>
                        {isHigh ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-3">
                        <div>
                          <div className="body-font text-[10px] uppercase tracking-wider text-stone-400">Расчётный риск</div>
                          <div className={`display-font text-2xl font-semibold ${isHigh ? 'text-amber-700' : 'text-emerald-600'}`}>
                            {r.value}
                          </div>
                        </div>
                        <div className="text-stone-300 display-font text-xl">/</div>
                        <div>
                          <div className="body-font text-[10px] uppercase tracking-wider text-stone-400">Порог</div>
                          <div className="display-font text-base text-stone-500">{r.threshold}</div>
                        </div>
                      </div>
                      <p className={`body-font text-xs mt-3 leading-relaxed ${isHigh ? 'text-stone-700' : 'text-stone-500'}`}>{r.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ИНФЕКЦИИ */}
            <div className="stagger-item rounded-3xl bg-white border border-stone-200/70 p-7"
                 style={{ animationDelay: '320ms', boxShadow: '0 10px 40px -15px rgba(0,0,0,0.08)' }}>
              <div className="display-font text-xl font-semibold text-stone-800 mb-1">Инфекции</div>
              <div className="body-font text-sm text-stone-500 mb-1">{geneticsData.infections.date}</div>
              <div className="body-font text-xs text-stone-400 mb-5">{geneticsData.infections.lab}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {geneticsData.infections.tests.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="body-font text-sm font-medium text-stone-800">{c.name}</span>
                    </div>
                    <span className="body-font text-xs font-semibold text-emerald-700 uppercase tracking-wide">{c.result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* МОНИТОРИНГ */}
        {activeCategory === 'monitoring' && (() => {
          const data = monitoringData.weekly;
          const latest = data[data.length - 1];
          const totalGainNum = latest.weight - monitoringData.startWeight;
          const totalGain = totalGainNum.toFixed(1);
          const expectedGain = monitoringData.targets.currentExpectedGain;
          const gainOk = totalGainNum >= expectedGain[0] && totalGainNum <= expectedGain[1];
          const bpOk = latest.sys >= monitoringData.targets.sys[0] && latest.sys <= monitoringData.targets.sys[1] &&
                       latest.dia >= monitoringData.targets.dia[0] && latest.dia <= monitoringData.targets.dia[1];

          const stats = [
            { label: 'Артериальное давление', value: `${latest.sys}/${latest.dia}`, unit: 'мм рт.ст.',
              ok: bpOk, target: `${monitoringData.targets.sys[0]}–${monitoringData.targets.sys[1]} / ${monitoringData.targets.dia[0]}–${monitoringData.targets.dia[1]}`,
              icon: HeartPulse, color: '#fb7185' },
            { label: 'Вес', value: latest.weight, unit: 'кг',
              ok: gainOk, target: `прибавка ${expectedGain[0]}–${expectedGain[1]} кг к этой нед.`,
              extra: `+${totalGain} кг от старта`, icon: Weight, color: '#a78bfa' },
            { label: 'Пульс', value: latest.pulse, unit: 'уд/мин',
              ok: latest.pulse >= 60 && latest.pulse <= 100, target: '60–100 уд/мин',
              icon: Activity, color: '#fbbf24' },
            { label: 'Отёки', value: latest.edema === 0 ? 'Нет' : latest.edema === 1 ? 'Лёгкие' : 'Выражены',
              unit: '', ok: latest.edema <= 1, target: 'не более лёгких',
              icon: Footprints, color: '#67e8f9' },
          ];

          return (
            <div className="space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <h2 className="display-font text-3xl font-semibold text-stone-800">Мониторинг</h2>
                  <p className="body-font text-sm text-stone-500 mt-1">Давление, вес, пульс и отёки по неделям беременности</p>
                </div>
                <span className="body-font text-sm text-stone-500">Неделя {latest.week}</span>
              </div>

              {/* Текущие показатели */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="stagger-item rounded-2xl p-5 bg-white border border-stone-200/70"
                         style={{ animationDelay: `${i * 60}ms`, boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                             style={{ backgroundColor: `${s.color}20` }}>
                          <Icon className="w-4 h-4" style={{ color: s.color }} />
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider body-font font-bold px-2 py-0.5 rounded-full ${
                          s.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {s.ok ? 'Норма' : 'Внимание'}
                        </span>
                      </div>
                      <div className="body-font text-xs text-stone-500 mb-1">{s.label}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="display-font text-3xl font-semibold text-stone-800">{s.value}</span>
                        {s.unit && <span className="body-font text-xs text-stone-500">{s.unit}</span>}
                      </div>
                      {s.extra && <div className="body-font text-xs text-emerald-600 font-medium mt-1">{s.extra}</div>}
                      <div className="body-font text-[11px] text-stone-400 mt-2">цель: {s.target}</div>
                    </div>
                  );
                })}
              </div>

              {/* График давления */}
              <div className="rounded-3xl bg-white border border-stone-200/70 p-6"
                   style={{ boxShadow: '0 10px 40px -15px rgba(0,0,0,0.08)' }}>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="display-font text-xl font-semibold text-stone-800">Артериальное давление</div>
                    <div className="body-font text-xs text-stone-500 mt-0.5">Систолическое / диастолическое по неделям</div>
                  </div>
                  <div className="flex items-center gap-3 body-font text-xs">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-400 rounded" />Сист.</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-400 rounded" />Диаст.</div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#78716c', fontFamily: 'Inter' }}
                             label={{ value: 'неделя', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#a8a29e' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#78716c', fontFamily: 'Inter' }} domain={[55, 130]} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 12, fontFamily: 'Inter' }}
                               labelFormatter={(w) => `Неделя ${w}`} />
                      <Line type="monotone" dataKey="sys" stroke="#fb7185" strokeWidth={2.5}
                            dot={{ r: 4, fill: '#fb7185', strokeWidth: 2, stroke: 'white' }} name="Систолическое" />
                      <Line type="monotone" dataKey="dia" stroke="#a78bfa" strokeWidth={2.5}
                            dot={{ r: 4, fill: '#a78bfa', strokeWidth: 2, stroke: 'white' }} name="Диастолическое" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Антропометрия и цели прибавки */}
              <div className="rounded-3xl p-6 border border-stone-200/70"
                   style={{
                     background: 'linear-gradient(135deg, #faf5ff 0%, #fef3f2 100%)',
                     boxShadow: '0 10px 40px -15px rgba(167,139,250,0.15)',
                   }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <div className="body-font text-[10px] uppercase tracking-wider text-stone-500 mb-1">Рост</div>
                    <div className="flex items-baseline gap-1">
                      <span className="display-font text-2xl font-semibold text-stone-800">{monitoringData.height}</span>
                      <span className="body-font text-xs text-stone-500">см</span>
                    </div>
                  </div>
                  <div>
                    <div className="body-font text-[10px] uppercase tracking-wider text-stone-500 mb-1">Стартовый вес</div>
                    <div className="flex items-baseline gap-1">
                      <span className="display-font text-2xl font-semibold text-stone-800">{monitoringData.startWeight}</span>
                      <span className="body-font text-xs text-stone-500">кг · декабрь</span>
                    </div>
                  </div>
                  <div>
                    <div className="body-font text-[10px] uppercase tracking-wider text-stone-500 mb-1">ИМТ до беременности</div>
                    <div className="flex items-baseline gap-1">
                      <span className="display-font text-2xl font-semibold text-stone-800">{monitoringData.bmiPrePregnancy}</span>
                      <span className="body-font text-xs text-emerald-600 font-medium">{monitoringData.bmiCategory}</span>
                    </div>
                  </div>
                  <div>
                    <div className="body-font text-[10px] uppercase tracking-wider text-stone-500 mb-1">Целевая прибавка</div>
                    <div className="flex items-baseline gap-1">
                      <span className="display-font text-2xl font-semibold text-stone-800">{monitoringData.targets.weightGainTotal[0]}–{monitoringData.targets.weightGainTotal[1]}</span>
                      <span className="body-font text-xs text-stone-500">кг за всю</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* График веса */}
              <div className="rounded-3xl bg-white border border-stone-200/70 p-6"
                   style={{ boxShadow: '0 10px 40px -15px rgba(0,0,0,0.08)' }}>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="display-font text-xl font-semibold text-stone-800">Динамика веса</div>
                    <div className="body-font text-xs text-stone-500 mt-0.5">
                      Старт: {monitoringData.startWeight} кг · Сейчас: {latest.weight} кг · Прибавка: <span className="text-emerald-600 font-semibold">+{totalGain} кг</span>
                      <span className="text-stone-400"> · ожидаемая к 21 нед: {monitoringData.targets.currentExpectedGain[0]}–{monitoringData.targets.currentExpectedGain[1]} кг</span>
                    </div>
                  </div>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                      <defs>
                        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#78716c', fontFamily: 'Inter' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#78716c', fontFamily: 'Inter' }} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 12, fontFamily: 'Inter' }}
                               labelFormatter={(w) => `Неделя ${w}`}
                               formatter={(v) => [`${v} кг`, 'Вес']} />
                      <Area type="monotone" dataKey="weight" stroke="#a78bfa" strokeWidth={2.5}
                            fill="url(#weightGrad)" dot={{ r: 4, fill: '#a78bfa', strokeWidth: 2, stroke: 'white' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Журнал по неделям */}
              <div className="rounded-3xl bg-white border border-stone-200/70 overflow-hidden"
                   style={{ boxShadow: '0 10px 40px -15px rgba(0,0,0,0.08)' }}>
                <div className="p-6 pb-3">
                  <div className="display-font text-xl font-semibold text-stone-800">Журнал замеров</div>
                  <div className="body-font text-xs text-stone-500 mt-0.5">{data.length} записей с 6-й недели</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-y border-stone-100 bg-stone-50/50">
                        <th className="text-left px-6 py-3 body-font text-[10px] uppercase tracking-wider font-bold text-stone-500">Неделя</th>
                        <th className="text-left px-3 py-3 body-font text-[10px] uppercase tracking-wider font-bold text-stone-500">АД</th>
                        <th className="text-left px-3 py-3 body-font text-[10px] uppercase tracking-wider font-bold text-stone-500">Вес</th>
                        <th className="text-left px-3 py-3 body-font text-[10px] uppercase tracking-wider font-bold text-stone-500">Пульс</th>
                        <th className="text-left px-3 py-3 body-font text-[10px] uppercase tracking-wider font-bold text-stone-500">Отёки</th>
                        <th className="text-left px-6 py-3 body-font text-[10px] uppercase tracking-wider font-bold text-stone-500">Заметка</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...data].reverse().map((row, i) => (
                        <tr key={i} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-3 display-font font-semibold text-stone-800">{row.week}</td>
                          <td className="px-3 py-3 body-font text-sm text-stone-700">{row.sys}/{row.dia}</td>
                          <td className="px-3 py-3 body-font text-sm text-stone-700">{row.weight} кг</td>
                          <td className="px-3 py-3 body-font text-sm text-stone-700">{row.pulse}</td>
                          <td className="px-3 py-3 body-font text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              row.edema === 0 ? 'bg-emerald-50 text-emerald-700' :
                              row.edema === 1 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {row.edema === 0 ? 'нет' : row.edema === 1 ? 'лёгкие' : 'выражены'}
                            </span>
                          </td>
                          <td className="px-6 py-3 body-font text-xs text-stone-500 italic">{row.note || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {!['overview', 'ultrasound', 'genetics', 'monitoring'].includes(activeCategory) && (
          <div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
              <div>
                <h2 className="display-font text-3xl font-semibold text-stone-800">{categories.find((c) => c.id === activeCategory)?.name}</h2>
                <p className="body-font text-sm text-stone-500 mt-1">
                  Текущие значения — {trimesters[currentTrimester - 1].name}, сравнение с предыдущим триместром
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="text" placeholder="Поиск показателя..." value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="pl-10 pr-4 py-2.5 rounded-full bg-white/80 border border-stone-200 body-font text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all w-64" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMetrics.map((metric, idx) => {
                const cfg = statusConfig[metric.status];
                const StatusIcon = cfg.icon;
                const ChangeIcon = metric.change > 0.5 ? TrendingUp : metric.change < -0.5 ? TrendingDown : Minus;
                const hasMultiplePoints = metric.trend.length > 1;
                const normalDisplay = Array.isArray(metric.normal)
                  ? `${metric.normal[0]}–${metric.normal[1]} ${metric.unit}`
                  : `${metric.normal} ${metric.unit}`;
                return (
                  <div key={metric.key} onClick={() => setSelectedMetric(metric)}
                       className="stagger-item group cursor-pointer rounded-2xl p-5 bg-white border border-stone-200/70 hover:border-stone-300 hover:-translate-y-0.5 transition-all"
                       style={{ animationDelay: `${idx * 40}ms`, boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="display-font text-base font-semibold text-stone-800 truncate">{metric.name}</div>
                        <div className="body-font text-[11px] text-stone-500 mt-0.5">норма {normalDisplay}</div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] uppercase tracking-wider body-font font-bold flex-shrink-0"
                           style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="display-font text-3xl font-semibold text-stone-800">{metric.current}</span>
                      <span className="body-font text-xs text-stone-500">{metric.unit}</span>
                    </div>
                    {metric.previous !== null && metric.previous !== undefined && typeof metric.current === 'number' && typeof metric.previous === 'number' && (
                      <div className="flex items-center gap-1.5 mb-3 body-font text-xs">
                        <ChangeIcon className={`w-3 h-3 ${metric.change > 0.5 ? 'text-rose-500' : metric.change < -0.5 ? 'text-blue-500' : 'text-stone-400'}`} />
                        <span className="text-stone-500">{metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}% от прошлого замера</span>
                      </div>
                    )}
                    {hasMultiplePoints ? (
                      <>
                        <div className="h-12 -mx-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metric.trend}>
                              <defs>
                                <linearGradient id={`grad-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={cfg.color} stopOpacity={0.4} />
                                  <stop offset="100%" stopColor={cfg.color} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 11, fontFamily: 'Inter', padding: '6px 10px' }}
                                       formatter={(val) => [`${val} ${metric.unit}`, '']}
                                       labelFormatter={(l, p) => p?.[0]?.payload?.label || ''} />
                              <Area type="monotone" dataKey="value" stroke={cfg.color} strokeWidth={2}
                                    fill={`url(#grad-${metric.key})`} dot={{ r: 3, fill: cfg.color, strokeWidth: 0 }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between body-font text-[10px] uppercase tracking-wider text-stone-400 mt-1">
                          {metric.trend.map((t, i) => <span key={i}>{t.label}</span>)}
                        </div>
                      </>
                    ) : (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-stone-100 body-font text-[10px] uppercase tracking-wider text-stone-500">
                        <Calendar className="w-3 h-3" />
                        {metric.currentLabel} · 17.02.2026
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {filteredMetrics.length === 0 && (
              <div className="text-center py-16 body-font text-stone-500">Ничего не найдено по запросу «{searchQuery}»</div>
            )}
          </div>
        )}
      </main>

      {selectedMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm" onClick={() => setSelectedMetric(null)}>
          <div className="relative max-w-xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
               onClick={(e) => e.stopPropagation()} style={{ animation: 'float-up 0.3s ease-out' }}>
            <button onClick={() => setSelectedMetric(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors z-10">
              <X className="w-4 h-4 text-stone-600" />
            </button>
            <div className="p-7 border-b border-stone-100" style={{ background: `linear-gradient(135deg, ${statusConfig[selectedMetric.status].bg} 0%, white 100%)` }}>
              <div className="text-xs uppercase tracking-widest body-font font-bold mb-2" style={{ color: statusConfig[selectedMetric.status].color }}>
                {statusConfig[selectedMetric.status].label}
              </div>
              <div className="display-font text-2xl font-semibold text-stone-800">{selectedMetric.name}</div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="display-font text-5xl font-semibold text-stone-800">{selectedMetric.current}</span>
                <span className="body-font text-base text-stone-500">{selectedMetric.unit}</span>
              </div>
              <div className="body-font text-sm text-stone-500 mt-1">
                Норма: {Array.isArray(selectedMetric.normal)
                  ? `${selectedMetric.normal[0]}–${selectedMetric.normal[1]} ${selectedMetric.unit}`
                  : `${selectedMetric.normal} ${selectedMetric.unit}`}
              </div>
            </div>
            <div className="p-7">
              <div className="text-[10px] uppercase tracking-widest body-font font-bold text-stone-500 mb-2">Что это значит</div>
              <p className="body-font text-sm text-stone-700 leading-relaxed mb-6">{selectedMetric.description}</p>
              {selectedMetric.trend && selectedMetric.trend.length > 1 ? (
                <>
                  <div className="text-[10px] uppercase tracking-widest body-font font-bold text-stone-500 mb-3">Динамика по триместрам</div>
                  <div className="h-40 mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedMetric.trend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#78716c', fontFamily: 'Inter' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#78716c', fontFamily: 'Inter' }} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 12, fontFamily: 'Inter' }}
                                 formatter={(val) => [`${val} ${selectedMetric.unit}`, selectedMetric.name]} />
                        <Line type="monotone" dataKey="value" stroke={statusConfig[selectedMetric.status].color}
                              strokeWidth={2.5} dot={{ r: 5, fill: statusConfig[selectedMetric.status].color, strokeWidth: 2, stroke: 'white' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-center body-font text-xs text-stone-500">
                  Один замер · {selectedMetric.currentLabel}. Динамика появится после следующих анализов.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto px-6 py-12 text-center body-font text-xs text-stone-400">
        Демо-данные · Дашборд для отслеживания беременности · Не заменяет консультацию врача
      </footer>
    </div>
  );
};

export default App;
