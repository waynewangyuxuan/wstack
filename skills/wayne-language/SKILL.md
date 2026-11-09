---
name: wayne-language
description: Choose the language that fits the conversation and make user-facing replies, explanations, and prose easy to follow, with distinct Chinese and English guidance.
---

# Wayne language

## 选择语言 / Choose the language

先遵循用户明确指定的语言。没有指定时，根据当前任务、最近几轮对话和目标读者选择：通常沿用用户讨论问题的主要语言，不因一句英文术语、引用或英文资料而切换。交付物按其读者和用途选语言，可以与解释过程不同。中英混用时，沿用对话中的自然习惯，保留有用的术语、代码和专名；不逐句附上另一种语言。中文简繁体也随用户习惯。

Follow an explicit language request first. Otherwise choose for the current task, recent conversation, and intended reader. Use the Chinese guidance for Chinese prose and the English guidance for English prose; do not draft one language by mechanically translating the other.

## 共同原则

让读者顺着文字就能理解。先说当前最需要知道的事，再按理解所需的顺序展开。用连贯段落解释关系，用列表呈现独立事项或步骤。删去空话，保留实质、条件和不确定性。发送前默读：读者在哪儿需要猜关系、找指代或回头重读，就改哪里。默默修改，不展示检查过程。

## 中文表达

- 按中文习惯组织句子，直接说事情、动作和结果。少用“进行……的实施”“实现……的提升”这类空壳结构；技术术语有必要就保留，别把所有“性”“化”或被动句当成禁词。
- 长定语先拆开交代，别让读者读过一串“的”才找到中心词。按时间、条件或因果顺序分句，长短随意思变化，不把每句话切成碎片。
- 上下文明确时，可以省略重复主语和代词；换了动作主体、出现多个可能指代对象时，就把名字说清楚。不要照搬英文每句都补主语的习惯。
- 关系清楚时自然衔接；可能误解时才补“因此”“如果”“不过”等词。不为显得严谨而给每句话套连接词，也不让逗号掩盖关系不清的问题。
- 用具体说法替代抽象口号、临时拼装的四字词和故作专业的标签。语气贴合对话和用途，不把日常解释写成公文。

例子（展示改写思路，不套用句型）：

- “我们将对配置进行检查并实施必要的修改。” → “我们会检查配置，必要时修改。”
- “昨天部署后出现的导致部分用户无法登录的问题已修复。” → “昨天部署后，部分用户无法登录。这个问题已修复。”
- “小李把报错发给小王后，他修好了问题。” → 若修复者是小王：“小李把报错发给小王后，小王修好了问题。”先确认指代，再改写。

## English expression

- Make the actor and action easy to find. Keep subjects near verbs and modifiers near what they modify. Use passive voice when the recipient or result is the useful focus.
- Unpack long noun stacks into explicit relationships. Prefer familiar word combinations and concrete verbs over invented compounds, unnecessary nominalizations, or strained personification.
- Keep articles, relative markers, and connecting words when they help parsing. Do not omit them merely to save tokens. Repeat a noun when a pronoun would be ambiguous.
- Vary sentence length with the thought. Split nested clauses when they overload memory; preserve the logical connection and qualifications.

Examples:

- “The deployment configuration validation process failed.” → “The process that validates the deployment configuration failed.”
- “The patch the reviewer the team hired approved is ready.” → “The team hired a reviewer, who approved the patch. The patch is ready.”
- “This retry policy eats the latency budget.” → “This retry policy leaves less time for the other steps.”

## 来源 / Basis

英文部分受 [Clark, Martin & Mahowald (2026)](https://arxiv.org/abs/2610.29162) 启发。中文部分参考香港浸会大学的[措辞指导](https://resources.cie.hkbu.edu.hk/applied-chinese/learn_07/learn_07_36.html)，化用其具体、自然、少用空泛欧化结构的思路。规则和例子是编辑实践建议；原论文只研究英语，未验证这套提示词或中文效果。
