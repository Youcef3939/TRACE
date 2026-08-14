export type Verdict = "True" | "False" | "Misleading" | "Not enough evidence";

export interface LabClaim {
  id: string;
  level: number;
  skill: string;
  type: "tweet" | "news" | "facebook" | "whatsapp";
  author: string;
  authorHandle?: string;
  date?: string;
  content: string;
  groundTruthVerdict: Verdict;
  explanation: string;
}

export const LAB_CLAIMS: LabClaim[] = [
  // --- LEVEL 1: SOURCE CREDIBILITY ---
  {
    id: "l1-1",
    level: 1,
    skill: "Source Credibility",
    type: "news",
    author: "Denver Guardian",
    content: "FBI Agent Suspected In Hillary Email Leaks Found Dead In Apparent Murder-Suicide.",
    groundTruthVerdict: "False",
    explanation: "This was a highly viral article from 2016. The 'Denver Guardian' was a completely fabricated website designed to look like a local news outlet, created purely to spread this specific hoax."
  },
  {
    id: "l1-2",
    level: 1,
    skill: "Source Credibility",
    type: "tweet",
    author: "Health Freedom Patriot",
    authorHandle: "@TruthMeds2024",
    content: "The WHO has officially admitted that 5G towers were the actual root cause of the respiratory symptoms seen in 2020. It was radiation, not a virus!",
    groundTruthVerdict: "False",
    explanation: "There is zero scientific or official backing for this. The World Health Organization has explicitly debunked this on their official myth-busters page. Unverified Twitter accounts often impersonate whistleblowers."
  },
  {
    id: "l1-3",
    level: 1,
    skill: "Source Credibility",
    type: "facebook",
    author: "End Times Prophecy",
    content: "The World Economic Forum just published their 2030 agenda: 'You will own nothing and you will be happy.' They are openly planning to confiscate all private property.",
    groundTruthVerdict: "Misleading",
    explanation: "The phrase was from a 2016 WEF essay predicting one possible future of a rental-based economy, not a declared goal or policy to confiscate property. It was heavily twisted by conspiracy groups."
  },
  {
    id: "l1-4",
    level: 1,
    skill: "Source Credibility",
    type: "news",
    author: "Associated Press",
    content: "NASA's James Webb Space Telescope captures clearest view yet of the Pillars of Creation.",
    groundTruthVerdict: "True",
    explanation: "The Associated Press is a globally recognized, highly credible news wire. The James Webb Space Telescope indeed captured and published this famous image in 2022."
  },
  {
    id: "l1-5",
    level: 1,
    skill: "Source Credibility",
    type: "whatsapp",
    author: "Forwarded Many Times",
    content: "DO NOT accept a video call from 'Martinelli'. It will hack your phone in 10 seconds and wipe all your bank accounts. Forward to everyone!",
    groundTruthVerdict: "False",
    explanation: "This is a classic 'Martinelli' WhatsApp chain-letter hoax that has circulated since 2017. Receiving a video call cannot execute code to wipe your bank accounts."
  },
  {
    id: "l1-6",
    level: 1,
    skill: "Source Credibility",
    type: "tweet",
    author: "ABC News Alert (Parody)",
    authorHandle: "@ABC_Breaking_News_",
    content: "BREAKING: Queen Elizabeth II has been pronounced dead following a sudden heart attack. (Posted in 2018)",
    groundTruthVerdict: "False",
    explanation: "This was a real hoax from 2018. The account used the ABC News logo but was a parody/impersonation account. A quick check of the actual @ABC account or their website showed no such report."
  },

  // --- LEVEL 2: CONTEXT ---
  {
    id: "l2-1",
    level: 2,
    skill: "Context",
    type: "tweet",
    author: "Concerned Citizen",
    authorHandle: "@TexasProud",
    content: "Look at these empty grocery shelves in Texas today! Socialism has failed us. We are starving!",
    groundTruthVerdict: "Misleading",
    explanation: "While the photo of empty shelves is real, reverse image searching reveals it was taken in Japan in 2011 just before a major typhoon, not in Texas today."
  },
  {
    id: "l2-2",
    level: 2,
    skill: "Context",
    type: "facebook",
    author: "Political Watch",
    content: "Video shows President Biden falling asleep during a critical meeting with survivors of the Maui wildfires.",
    groundTruthVerdict: "Misleading",
    explanation: "The video is real, but selectively edited. Full footage shows the President was bowing his head in prayer and listening to a speaker, not sleeping."
  },
  {
    id: "l2-3",
    level: 2,
    skill: "Context",
    type: "news",
    author: "Viral News Hub",
    content: "Terrifying! A massive shark was spotted swimming down a flooded highway in New Jersey during Hurricane Sandy.",
    groundTruthVerdict: "False",
    explanation: "This is one of the most famous fake context images on the internet. It's a digital composite of a great white shark from South Africa superimposed onto a flooded street."
  },
  {
    id: "l2-4",
    level: 2,
    skill: "Context",
    type: "tweet",
    author: "Climate Skeptic",
    authorHandle: "@NoWarming",
    content: "Greta Thunberg exposed! Here is a photo of her eating a massive feast on a train right next to starving children looking at her through the window.",
    groundTruthVerdict: "False",
    explanation: "The image is photoshopped. The original photo showed Greta Thunberg eating on a train looking at trees out the window. The 'starving children' were digitally pasted in."
  },
  {
    id: "l2-5",
    level: 2,
    skill: "Context",
    type: "whatsapp",
    author: "Family Group",
    content: "Pray for the Amazon! Look at these photos of the rainforest burning completely to the ground right now! (Sent in 2019)",
    groundTruthVerdict: "Misleading",
    explanation: "While there were fires in 2019, many viral photos shared were actually taken by photographers 15 to 20 years earlier, or were photos of completely different forests."
  },
  {
    id: "l2-6",
    level: 2,
    skill: "Context",
    type: "news",
    author: "Reuters",
    content: "U.S. inflation rate drops to 3.2% in October, matching economist expectations.",
    groundTruthVerdict: "True",
    explanation: "This is a factual reporting of macroeconomic data in its proper context, reflecting official Bureau of Labor Statistics reports without hyperbole."
  },

  // --- LEVEL 3: EVIDENCE ---
  {
    id: "l3-1",
    level: 3,
    skill: "Evidence",
    type: "news",
    author: "Health & Wellness Daily",
    content: "New study proves that the MMR vaccine is directly linked to causing autism in young children.",
    groundTruthVerdict: "False",
    explanation: "This references Andrew Wakefield's 1998 paper, which was fully retracted. He falsified data. Countless global, peer-reviewed studies involving millions of children have found zero link between vaccines and autism."
  },
  {
    id: "l3-2",
    level: 3,
    skill: "Evidence",
    type: "tweet",
    author: "Alternative Medicine",
    authorHandle: "@NatureCures",
    content: "Big Pharma won't tell you this, but drinking a solution of bleach (MMS) completely cures cancer and COVID-19 within days.",
    groundTruthVerdict: "False",
    explanation: "There is absolutely no medical evidence for this. 'Miracle Mineral Solution' is industrial bleach. Drinking it causes severe organ damage and has no curative properties."
  },
  {
    id: "l3-3",
    level: 3,
    skill: "Evidence",
    type: "facebook",
    author: "Truth Seeker 1776",
    content: "The Earth is not a globe. Look at the horizon over the ocean—it is perfectly flat. Water always finds its level. NASA is a multi-billion dollar hoax.",
    groundTruthVerdict: "False",
    explanation: "The horizon appears flat due to the massive size of the Earth relative to the observer. Millennia of physics, astronomy, satellite imagery, and navigation provide overwhelming evidence of a spherical Earth."
  },
  {
    id: "l3-4",
    level: 3,
    skill: "Evidence",
    type: "news",
    author: "Science Magazine",
    content: "Global average temperatures have risen by approximately 1.1°C since the late 19th century, driven largely by increased carbon dioxide emissions.",
    groundTruthVerdict: "True",
    explanation: "This is the overwhelming consensus of the global scientific community, backed by decades of direct temperature measurements, ice core samples, and atmospheric data from NASA and NOAA."
  },
  {
    id: "l3-5",
    level: 3,
    skill: "Evidence",
    type: "tweet",
    author: "Nutrition Facts",
    authorHandle: "@HealthyLiving",
    content: "Eating massive amounts of carrots will dramatically improve your eyesight and allow you to see clearly in the dark.",
    groundTruthVerdict: "Misleading",
    explanation: "While carrots have Vitamin A (good for eye health), they don't grant night vision. This myth was literally British WWII propaganda created to hide the fact that they had invented radar to spot German bombers at night."
  },
  {
    id: "l3-6",
    level: 3,
    skill: "Evidence",
    type: "facebook",
    author: "Election Integrity Project",
    content: "There were 10,000 dead people who voted in Michigan! We have sworn affidavits proving massive fraud.",
    groundTruthVerdict: "Not enough evidence",
    explanation: "While affidavits represent someone's belief, numerous court cases and state audits found no evidence of 10,000 dead voters. Claims require verifiable proof, not just allegations."
  },

  // --- LEVEL 4: VERIFICATION ---
  {
    id: "l4-1",
    level: 4,
    skill: "Verification",
    type: "news",
    author: "WTOE 5 News",
    content: "Pope Francis Shocks World, Endorses Donald Trump for President.",
    groundTruthVerdict: "False",
    explanation: "This was one of the most widely shared fake news stories of the 2016 election. WTOE 5 was a fake news site, and no reputable global news organization corroborated the Pope endorsing a US candidate."
  },
  {
    id: "l4-2",
    level: 4,
    skill: "Verification",
    type: "tweet",
    author: "Conspiracy Archive",
    authorHandle: "@DeepStateExposed",
    content: "Wayfair is selling industrial cabinets for $10,000 named 'Sam' and 'Mia'. They are actually trafficking missing children inside the furniture!",
    groundTruthVerdict: "False",
    explanation: "This viral 2020 conspiracy theory was entirely unfounded. The high prices were algorithmic pricing errors for industrial cabinets, and the names were just standard product lines. Law enforcement found zero evidence of trafficking."
  },
  {
    id: "l4-3",
    level: 4,
    skill: "Verification",
    type: "whatsapp",
    author: "Community Alert",
    content: "Warning! FEMA is currently setting up roadblocks in the hurricane disaster zone to confiscate all food and water donations from private citizens.",
    groundTruthVerdict: "False",
    explanation: "A recurring disaster myth. State police, local governments, and FEMA regularly debunk this during every major hurricane. You can verify this by checking official local government emergency channels."
  },
  {
    id: "l4-4",
    level: 4,
    skill: "Verification",
    type: "tweet",
    author: "Pop Culture Daily",
    authorHandle: "@CelebGossip",
    content: "Tom Cruise has tragically died in a snowboarding accident in New Zealand this morning. RIP to a legend.",
    groundTruthVerdict: "False",
    explanation: "A classic internet death hoax template. If a star like Tom Cruise died, every major outlet (BBC, NYT, Variety) would immediately break the news. If only a random Twitter account posts it, it's fake."
  },
  {
    id: "l4-5",
    level: 4,
    skill: "Verification",
    type: "news",
    author: "BBC News",
    content: "Apple has officially announced the Vision Pro, a mixed-reality headset marking its first major new product category in years.",
    groundTruthVerdict: "True",
    explanation: "This is a verifiable fact that can be cross-checked instantly by looking at Apple's official press releases or any other major tech publication from June 2023."
  },
  {
    id: "l4-6",
    level: 4,
    skill: "Verification",
    type: "tweet",
    author: "Gen Z Historian",
    authorHandle: "@TikTokFacts",
    content: "Helen Keller was a total fraud. There is absolutely no way someone who is deaf and blind could learn to write books or fly a plane. It was all a PR stunt.",
    groundTruthVerdict: "False",
    explanation: "A bizarrely popular TikTok conspiracy. Historical records, thousands of witnesses, her extensive correspondence, and documented methods of tactile sign language prove her existence and accomplishments beyond a doubt."
  },

  // --- LEVEL 5: ADVANCED / AI ---
  {
    id: "l5-1",
    level: 5,
    skill: "Advanced / AI",
    type: "tweet",
    author: "Streetwear Culture",
    authorHandle: "@DripCheck",
    content: "The Pope is out here in Vatican City wearing a massive Balenciaga white puffer jacket. Hardest fit of the year.",
    groundTruthVerdict: "False",
    explanation: "This was a highly viral AI-generated image created using Midjourney in 2023. Upon close inspection, the crucifix chain is distorted, his glasses merge into his face, and his hand is deformed."
  },
  {
    id: "l5-2",
    level: 5,
    skill: "Advanced / AI",
    type: "facebook",
    author: "Patriot News Network",
    content: "Breaking: Photos have just leaked showing Donald Trump actively resisting arrest and fighting off NYPD officers in the streets of New York!",
    groundTruthVerdict: "False",
    explanation: "These were AI-generated images created by Eliot Higgins on Midjourney prior to Trump's actual indictment. The officers have warped faces, there are three legs on one person, and the lighting is artificially glossy."
  },
  {
    id: "l5-3",
    level: 5,
    skill: "Advanced / AI",
    type: "tweet",
    author: "Bloomberg Feed (Verified Parody)",
    authorHandle: "@B1oombergNews",
    content: "BREAKING: Massive explosion reported near the Pentagon complex in Washington D.C. Initial reports indicate multiple casualties.",
    groundTruthVerdict: "False",
    explanation: "In May 2023, an AI-generated image of a fake Pentagon explosion was tweeted by a verified 'blue tick' account impersonating Bloomberg. It briefly caused the US stock market to dip before being debunked by the local fire department."
  },
  {
    id: "l5-4",
    level: 5,
    skill: "Advanced / AI",
    type: "whatsapp",
    author: "Unknown Number",
    content: "Voice note: 'Hey mom, I lost my phone and I'm using a friend's. I'm in jail and need $5,000 for bail immediately. Please wire it, don't call me back on this number.' (Voice sounds exactly like the son).",
    groundTruthVerdict: "Not enough evidence",
    explanation: "This is a rapidly growing scam utilizing AI voice cloning technology trained on public social media videos. The best verification is to immediately hang up and call the family member's actual phone number."
  },
  {
    id: "l5-5",
    level: 5,
    skill: "Advanced / AI",
    type: "tweet",
    author: "Tech Insider",
    authorHandle: "@TechInsider",
    content: "OpenAI has officially revealed 'Sora', a new generative AI model capable of creating highly realistic, physics-accurate 60-second videos from text prompts.",
    groundTruthVerdict: "True",
    explanation: "This is a real announcement from OpenAI in early 2024. While AI generates fake things, the news about the existence of this specific AI tool is entirely factual and verifiable via OpenAI's website."
  },
  {
    id: "l5-6",
    level: 5,
    skill: "Advanced / AI",
    type: "tweet",
    author: "Pop Culture Gossip",
    authorHandle: "@CelebTEA",
    content: "Leaked audio! Taylor Swift caught on a hot mic admitting she hates her fans and only makes music for the money. Listen to the clip!",
    groundTruthVerdict: "Misleading",
    explanation: "Audio deepfakes (like those created with ElevenLabs) are becoming indistinguishable from reality. Unless major journalistic outlets verify the source of the audio through forensics, sensational 'leaked audio' should be assumed fake."
  }
];
