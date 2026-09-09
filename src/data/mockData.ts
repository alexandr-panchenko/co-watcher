import { TimelineAnchor, VideoLecture, SequenceBlock } from '../types';

export const ASSETS = {
  studioCam: "https://lh3.googleusercontent.com/aida/AEtjO1UwIArjrJ1xyU02ich2O6hta86tdkELybz0TrPCSQ08dO0ILQJk_Rx21TYpxX6ScVjm4_GCgtIPY5pvIR9h-zD9oXP_vK1tnFWii9ci7jevcWr0iJBL_dTLLn78mRFx8hSRZNTUAi2pJUWQxA8cW5jBBYF0KbW0z_sajVNezoJ6BV24rTh4QpaUd9QNhgvUmqxCxfMM1C6ABDI5TrkBO14hRknNr7M6padTJdoANsb5fC3N8AJp6pIGA9lm",
  diagram: "https://lh3.googleusercontent.com/aida/AEtjO1XQ7jgZHlGchCF6acMAQFqxcvjKjxVBBJXYpgjPaXoEvf9jkChtoxJuXAmmccQIrJ85z_zcrlit-ruyrEB4V9q-MdRSOht3ZHFQ4jac_5dd5NnpiStk3PGhu8Vmd-nUh-FaasAwSqev6tZljZUx-RChV8_7s06CXhOoyMAdZx9xqdyQneqXvaf-gaUgNiwWcR9A_Yyf580ERQHWhxYZxEZqhLid22sFShWl4RX1wIfgr1BhvYVzVzs-pf8",
  lectureStage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHrqZ2gZZZPfGjNYOhpc6CLd-Tr3yJWJHdKQB7qIgnxiS6d6yWD8jkdmFio8pa9qYjecjbZ0qmTwG0yKX0kdoFlizRZrO5MkmnNj1P5hUl3MuQG2CpRpmtO-xKI0Ew4ZoFJ8DwDE-QdsQ6Yyriu0ooHU39MBqJjLeW-zUGMnx841T9w5TV5bgTUT7sbLgvrIEbdHRt7cKbmNaYGlWYTzrcqp88l_P_tezHm65beDlZkfM3Wro5IdLufw",
  lecture1: "https://lh3.googleusercontent.com/aida/AEtjO1UGGjbo7C6JNTGoyZp54M7vYBnnu05IlyqvcEkHM5nLSIXO3J-p1H_z5HdNu6vSTi4cQcwmRoIRgdC5N8pVIDEA1Y2w-v3URA3ulmHEF-PHxWBjNo73OyuUvLGUlOME90__QnkM3TdKUHiOxc3ZANY0fggAiKrtE41zyAtlwc6Z2VPdkyse_R7fwPIJjdEBha6DopLaxm1p2jhsBjk46o5fXu5n8xoAyOghOGpthswp36THMSRTqNpWfRc",
  lecture2: "https://lh3.googleusercontent.com/aida/AEtjO1XPtrzaCc4tfhSAAjzjZghY3PJJ4yanVM0cVlF91wU1ApLh2Ww0aNqr4ZiIUqlsizURLND9FpLPLFQNAZtlTpwLTxKBcGAC1BjhOnmfak-LdRfTDfGminHjoBFKeEMj7a1RgsjJNZCfsRALyDokdv_6Hft8EvRURQQ2YgIUCB16VRIXkAwau9n1iBMUCgxPDJlVMUGmcD8trwyf9pW6vTzOxGuVOKGoTygizq2YerlF3EZQkw6j-Z6PnKE",
  lecture3: "https://lh3.googleusercontent.com/aida/AEtjO1X6iAtw4TP8qA4oVLYjf-zHRKNksrt_WFHXRpFhPx_QEzyU3jq-HEe_0KsiZcn6THE8tSOf4CxRCUspoUI-NERSXCIdxfLnuF7IkhpsyfDtIt0Rp9u9e8L0Am2RdCRd55fIrKDO_mwqplN05FnYtaIBsLDCM6CCZW4_ONN2v7GnQ1YNbyDD39-9hkV-4_XGue23K8zj3_kfAZ_-tmmtDuJdMdprggAn4Qs34-LHrVE2w9VVeToo5Fu9lEMV",
  lecture4: "https://lh3.googleusercontent.com/aida/AEtjO1WtWAUvnt2m9AZkh1lZPrtu_632xGXI6LUS8Yt-nYSDlOYdMU6qmtx3vfwuFaFjkvXNk7xEB6uqksnKp9n9lypvd0_4sIA-2XA0oh2EIIWTTcje7G-VNXMqNrjypfo0lhBQXNuoE6nIoCLDqwea2--axolbZYsm6BWZd3gkt-aGncYtHbzPw6NrrJBKJeCEO5HCTlgY9QpLGTPVPv6X6hN3n9HQOAVRJAnuPB5ENikcTTB6wRJnco250Rpq"
};

export const DISCOVERY_LECTURES: VideoLecture[] = [
  {
    id: "mit-csail",
    videoId: "bCz4OMemCcA",
    youtubeUrl: "https://www.youtube.com/watch?v=bCz4OMemCcA",
    title: "The Roots of AI: From Cybernetics to Connectionism",
    institution: "MIT CSAIL",
    duration: "54:12",
    durationSec: 3252,
    badgeType: "best-match",
    badgeLabel: "★ Best match",
    badgeCategory: "Comprehensive History",
    description: "Traces the foundational lineage from Norbert Wiener and the 1956 Dartmouth conference through the AI winters, focusing heavily on early thinkers and why symbolic systems stalled.",
    thumbnail: ASSETS.lecture1
  },
  {
    id: "stanford-hai",
    videoId: "O5xeyoRL95U",
    youtubeUrl: "https://www.youtube.com/watch?v=O5xeyoRL95U",
    title: "The Evolution of Neural Architectures: Perceptrons to Deep Nets",
    institution: "Stanford HAI",
    speaker: "Prof. Terry Sejnowski",
    duration: "1:08:40",
    durationSec: 4120,
    badgeType: "technical",
    badgeLabel: "Most Technical",
    badgeCategory: "Most Technical",
    description: "Deep dive into the mathematical debates between Rosenblatt, Minsky, and Rumelhart's backprop revival. Excellent if you want the underlying computational models explained rigorously.",
    thumbnail: ASSETS.lecture2
  },
  {
    id: "computer-history-museum",
    videoId: "IHZwWFHWa-w",
    youtubeUrl: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
    title: "Minds, Machines, and Rivalries: The People Who Built AI",
    institution: "Computer History Museum",
    speaker: "Panel",
    duration: "48:30",
    durationSec: 2910,
    badgeType: "clashes",
    badgeLabel: "People & Ideological Clashes",
    badgeCategory: "People & Ideological Clashes",
    description: "Firsthand accounts from pioneers detailing personal rivalries, funding shifts at DARPA, and the philosophical disputes between logic-based and statistical paradigms.",
    thumbnail: ASSETS.lecture3
  },
  {
    id: "oxford-martin",
    videoId: "z-EtmaFJieY",
    youtubeUrl: "https://www.youtube.com/watch?v=z-EtmaFJieY",
    title: "A 35-Minute Timeline of Modern Artificial Intelligence",
    institution: "Oxford Martin School",
    speaker: "Dr. Wooldridge",
    duration: "34:15",
    durationSec: 2055,
    badgeType: "quick",
    badgeLabel: "Quick Starting Point",
    badgeCategory: "Quick Starting Point",
    description: "Paced, accessible narrative bridging the 1950s golden years directly to the 2012 deep learning inflection point without getting bogged down in minutiae.",
    thumbnail: ASSETS.lecture4
  }
];

export const INITIAL_TIMELINE_ANCHORS: TimelineAnchor[] = [
  {
    id: "anchor-1",
    timeSec: 134, // 02:14
    timeFormatted: "02:14",
    title: "The RNN bottleneck of 2017",
    category: "architecture",
    categoryLabel: "Architecture",
    summary: "Sequential dependency prevented parallel training across GPU clusters, capping practical sequence length at 512 tokens.",
    thumbnail: ASSETS.diagram
  },
  {
    id: "anchor-2",
    timeSec: 340, // 05:40
    timeFormatted: "05:40",
    title: "Parallels to Bahdanau’s early additive attention",
    category: "foundations",
    categoryLabel: "Foundations",
    summary: "Bahdanau et al. (2014) introduced alignment vectors for NMT, but Vaswani stripped away recurrence entirely in favor of dot-products."
  },
  {
    id: "anchor-3",
    timeSec: 675, // 11:15
    timeFormatted: "11:15",
    title: "The pivotal whiteboard sketch at 11:15",
    category: "whiteboard",
    categoryLabel: "Whiteboard Note",
    summary: "Notice the matrix transposition diagram: QK^T / sqrt(d_k) prevents softmax vanishing gradients for high dimensional vectors."
  },
  {
    id: "anchor-4",
    timeSec: 845, // 14:05
    timeFormatted: "14:05",
    title: "Vaswani & Shazeer’s original breakthrough discussion",
    category: "fact-check",
    categoryLabel: "Fact-Check",
    summary: "The paper was drafted at Google Brain. While Noam Shazeer proposed multi-head attention splits, Niki Parmar implemented the core self-attention benchmarks.",
    detail: "Sources: ArXiv 1706.03762 • Google Research Blog",
    impact: "Resolved quadratic synchronization latencies across distributed TPU v2 pods.",
    isCluster: true,
    clusterCount: 3,
    clusterItems: [
      {
        id: "sub-1",
        title: "Vaswani & Shazeer breakthrough",
        category: "fact-check",
        categoryLabel: "Fact-Check",
        description: "“Attention Is All You Need” co-authorship context & division of architectural modules."
      },
      {
        id: "sub-2",
        title: "Multi-Head Attention vs Recurrence",
        category: "analysis",
        categoryLabel: "Analysis",
        description: "Memory bandwidth bottlenecks, KV caching overhead, and parallel GPU training speedups."
      },
      {
        id: "sub-3",
        title: "arXiv:1706.03762v7 Reference",
        category: "source",
        categoryLabel: "Source",
        description: "Citation snippet and equation (2) for Scaled Dot-Product Attention matrix transpositions."
      }
    ]
  },
  {
    id: "anchor-5",
    timeSec: 1112, // 18:32
    timeFormatted: "18:32",
    title: "Matrix dot-products vs additive scoring",
    category: "analysis",
    categoryLabel: "Analysis",
    summary: "Theoretical complexity is identical, but highly optimized matrix multiplication code (BLAS) makes dot-product attention drastically faster in real hardware."
  },
  {
    id: "anchor-6",
    timeSec: 1564, // 26:04
    timeFormatted: "26:04",
    title: "Compute constraints on 8 P100 GPUs",
    category: "benchmarks",
    categoryLabel: "Benchmarks",
    summary: "The base model was trained for 100,000 steps (12 hours) on 8 NVIDIA P100 GPUs, compared to days for comparable LSTM models."
  }
];

export const ASSEMBLED_CUT_BLOCKS: SequenceBlock[] = [
  {
    id: "block-1",
    number: 1,
    title: "Source Context Clip",
    type: "SOURCE VIDEO",
    timeRange: "0:00 – 0:20",
    startSec: 0,
    endSec: 20,
    durationFormatted: "0:20",
    description: "Vaswani intro on Scaled Dot-Product Attention slide (Source TS: 14:05 – 14:25)",
    thumbnail: ASSETS.diagram
  },
  {
    id: "block-2",
    number: 2,
    title: "User Reaction",
    type: "HUMAN VOICE & CAM",
    timeRange: "0:20 – 0:48",
    startSec: 20,
    endSec: 48,
    durationFormatted: "0:28",
    description: "“Why Multi-Head attention was non-obvious in 2017 & changed everything...”",
    thumbnail: ASSETS.studioCam,
    isActive: true
  },
  {
    id: "block-3",
    number: 3,
    title: "Supporting Diagram & Fact-Check",
    type: "AI CONTEXT OVERLAY",
    timeRange: "0:48 – 1:04",
    startSec: 48,
    endSec: 64,
    durationFormatted: "0:16",
    description: "Visual reference: Multi-Head Projection Matrix schematic + arXiv 1706.03762 quote",
    thumbnail: ASSETS.diagram
  },
  {
    id: "block-4",
    number: 4,
    title: "Source Conclusion",
    type: "SOURCE VIDEO",
    timeRange: "1:04 – 1:18",
    startSec: 64,
    endSec: 78,
    durationFormatted: "0:14",
    description: "Author remarks on P100 GPU cluster benchmark & training speedup (Source TS: 14:25 – 14:39)",
    thumbnail: ASSETS.diagram
  }
];

