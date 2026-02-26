import { ChildProfile, Story, StoryPage, StoryTheme } from '../types'

// ─── Theme Metadata ───────────────────────────────────────────────────────────

export const THEME_META: Record<
  StoryTheme,
  { label: string; emoji: string; color: string; description: string }
> = {
  dinosaurs:    { label: 'Dinosaur World',  emoji: '🦕', color: 'bg-green-400',  description: 'A prehistoric rescue mission in a land of giant dinos' },
  space:        { label: 'Space Explorer',  emoji: '🚀', color: 'bg-indigo-500', description: 'Blast off to a planet that looks just like your backyard' },
  fantasy:      { label: 'Magic Kingdom',   emoji: '🧙', color: 'bg-purple-500', description: 'Enchanted forests, dragons, and a legendary quest' },
  ocean:        { label: 'Ocean Adventure', emoji: '🐠', color: 'bg-cyan-500',   description: 'Dive deep where mermaids and sea creatures need your help' },
  superheroes:  { label: 'Super Squad',     emoji: '🦸', color: 'bg-red-500',    description: 'Discover your super powers and save the city' },
  jungle:       { label: 'Jungle Quest',    emoji: '🌴', color: 'bg-emerald-500',description: 'Trek through wild jungle to find the lost treasure' },
  'magic-school': { label: 'Magic Academy', emoji: '⚡', color: 'bg-amber-500',  description: 'Your first day at a school where spells come to life' },
}

// ─── Page-count target ───────────────────────────────────────────────────────

const PAGES_PER_STORY = 8

// ─── Template Generators ─────────────────────────────────────────────────────

type TemplateBuilder = (p: ChildProfile) => Omit<Story, 'id' | 'createdAt' | 'status'>

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Helper to build a StoryPage
const page = (
  id: number,
  text: string,
  illustrationPrompt: string,
  emoji: string,
): StoryPage => ({ id, text, illustrationPrompt, emoji })

// ─── Dinosaurs ───────────────────────────────────────────────────────────────
const dinosaursTemplate: TemplateBuilder = (p) => ({
  childName: p.name,
  theme: 'dinosaurs',
  title: `${cap(p.name)} and the Great Dino Rescue`,
  pages: [
    page(1,
      `One sunny morning, ${cap(p.name)} discovered a magical fossil at ${p.favoritePlace}. The moment they touched it, the ground rumbled — and a baby Triceratops peeked out from behind a fern!`,
      `Warm sunny prehistoric landscape at ${p.favoritePlace}, a curious ${p.age}-year-old child with a glowing fossil, baby triceratops nearby, lush jungle, watercolor children's book style`,
      '🌄'),
    page(2,
      `The baby dino—who ${cap(p.name)} named Stompy—was in trouble. A river of lava was slowly creeping toward the dino valley. The elders were too big to cross the rickety vine bridge. Only someone small and brave enough could help.`,
      `Baby triceratops looking worried, lava river in distance, rickety vine bridge over chasm, wide-eyed child protagonist, children's book illustration`,
      '🌋'),
    page(3,
      `${cap(p.name)} remembered what ${p.bestFriend || 'their best friend'} always said: "Brave hearts find a way." Taking a deep breath, they stepped onto the bridge — one plank at a time.`,
      `Child carefully crossing wobbly vine bridge above misty chasm, bright colours, determined expression, children's book watercolour`,
      '🌉'),
    page(4,
      `On the other side lived a grumpy Ankylosaurus blocking the water channel. ${cap(p.name)} offered it a bundle of sweet ferns, and the great creature happily shuffled aside, letting the cool river flow back.`,
      `Friendly ankylosaurus eating ferns, child offering greenery, river flowing through colourful prehistoric valley, joyful scene, watercolour`,
      '🦎'),
    page(5,
      `Splash! The lava cooled into smooth black rock. The whole herd of dinosaurs trumpeted and stomped with joy. Even the scary part—the bit that reminded ${cap(p.name)} of ${p.fears}—turned out to be just a shadow.`,
      `Joyful herd of dinosaurs of all kinds celebrating, colourful fireworks of tropical flowers, child hero centre, bright children's book art`,
      '🎉'),
    page(6,
      `Stompy nuzzled ${cap(p.name)}'s cheek and handed them a tiny glittering dino egg — a gift to keep forever. ${cap(p.name)} tucked it safely into their pocket.`,
      `Child receiving tiny sparkling egg from baby triceratops, warm golden light, emotional tender moment, soft watercolour children's illustration`,
      '🥚'),
    page(7,
      `As the sun set over the valley, Stompy led ${cap(p.name)} to a secret portal back home. The whole dino valley watched and roared a gentle goodbye.`,
      `Magical glowing portal in jungle, child waving goodbye to hundreds of friendly dinosaurs in sunset light, children's book style`,
      '🌅'),
    page(8,
      `Back at ${p.favoritePlace}, ${cap(p.name)} smiled and hugged the little egg. The biggest adventures, they learned, happen when you believe in yourself — and in the friends who believe in you too.`,
      `Child at ${p.favoritePlace} at dusk holding glowing egg, stars beginning to appear, warm cosy children's book ending illustration`,
      '⭐'),
  ],
})

// ─── Space ───────────────────────────────────────────────────────────────────
const spaceTemplate: TemplateBuilder = (p) => ({
  childName: p.name,
  theme: 'space',
  title: `Captain ${cap(p.name)} and the Planet of Wonders`,
  pages: [
    page(1,
      `${cap(p.name)} was stargazing at ${p.favoritePlace} when a tiny silver rocket landed right in the garden. A friendly robot pilot popped out. "We need a brave captain!" it beeped.`,
      `Child looking through telescope at night, tiny silver rocket landing in garden, robot pilot waving, stars and nebula sky, children's book watercolour`,
      '🔭'),
    page(2,
      `Inside the rocket, a star-map showed a distant planet that looked surprisingly like ${p.favoritePlace}—except the trees were made of candy floss and the rivers ran with lemon fizz.`,
      `Inside cozy rocket cockpit with glowing star-map, candy-floss trees visible through porthole, child captain in mini space suit, warm illustration`,
      '🗺️'),
    page(3,
      `The robot co-pilot (who reminded ${cap(p.name)} a lot of ${p.bestFriend || 'their best friend'}) showed how to pull the launch lever. 5… 4… 3… 2… 1… WHOOSH!`,
      `Rocket blasting off leaving rainbow exhaust trail, Earth below, stars ahead, child and robot cheering inside cockpit, dynamic children's book art`,
      '🚀'),
    page(4,
      `A meteor shower blocked their path—each meteor sparkled with ${p.interests.join(' and ') || 'all the colours of the rainbow'}. ${cap(p.name)} steered right and left, threading through every single one.`,
      `Rocket weaving between sparkling colourful meteors, child captain focused at wheel, dramatic but fun children's illustration`,
      '☄️'),
    page(5,
      `They landed on Planet Wondros. The creatures there were worried — a tiny storm cloud had parked over their favourite meadow and refused to move. It growled like ${p.fears || 'thunderstorms'}.`,
      `Alien planet with candy-floss trees, cute alien creatures pointing at grumpy storm cloud, child and robot arriving, pastel children's book style`,
      '🌩️'),
    page(6,
      `${cap(p.name)} had an idea: they taught the cloud a silly song. The cloud laughed so hard it burst into rainbow confetti! Everyone danced in the glittering shower.`,
      `Storm cloud bursting into rainbow confetti, aliens and child dancing, joyful colourful explosion, children's book illustration`,
      '🌈'),
    page(7,
      `The aliens gave ${cap(p.name)} a glowing moon-stone as thanks — it would light their bedroom forever. The robot pilot did a happy spin, and they boarded for home.`,
      `Child receiving glowing moonstone from grateful alien creatures, warm sunset light on alien planet, children's book illustration`,
      '🌙'),
    page(8,
      `Back at ${p.favoritePlace}, ${cap(p.name)} placed the moonstone by the window. It glowed softly all night — a reminder that they were brave enough to fly among the stars.`,
      `Child's cosy bedroom, glowing moonstone on windowsill, stars outside, child asleep with smile, warm soft children's book ending`,
      '✨'),
  ],
})

// ─── Fantasy ─────────────────────────────────────────────────────────────────
const fantasyTemplate: TemplateBuilder = (p) => ({
  childName: p.name,
  theme: 'fantasy',
  title: `${cap(p.name)} and the Dragon's Secret`,
  pages: [
    page(1,
      `Deep in the Whispering Woods near ${p.favoritePlace}, a talking fox delivered ${cap(p.name)} a rolled-up map sealed with golden wax. "Only you can break the dragon's curse," it whispered.`,
      `Child receiving rolled map from talking fox in magical forest near ${p.favoritePlace}, golden light shafts, children's book watercolour`,
      '🦊'),
    page(2,
      `The map led past the Giggle Falls (where every drop of water laughed), through a meadow of dancing sunflowers, and up to the Crystal Mountain.`,
      `Child walking past laughing waterfall, dancing sunflowers, towards sparkling crystal mountain, enchanting children's book illustration`,
      '⛰️'),
    page(3,
      `At the mountain gate stood a stone riddle-keeper. The riddle was about ${p.interests[0] || 'something the child loved most'}. ${cap(p.name)} grinned — they knew this perfectly!`,
      `Child confidently answering stone riddle-keeper guardian, magical stone gate glowing as answer is given, triumphant children's book art`,
      '🗝️'),
    page(4,
      `Inside the mountain lived Ember — a small dragon no bigger than a cat. She wasn't scary at all. She was lonely. The curse was her sadness, spreading frost over the kingdom.`,
      `Small cat-sized dragon Ember looking sad inside sparkling crystal cave, frost flowers on walls, child approaching gently, soft watercolour`,
      '🐉'),
    page(5,
      `${cap(p.name)} remembered how it felt to face ${p.fears || 'something scary'} — and how everything felt better with a friend. They sat beside Ember and told her about ${p.bestFriend || 'their best friend'}.`,
      `Child sitting beside small dragon sharing stories, frost melting into flowers, warm glow returning to cave, tender children's book illustration`,
      '🌸'),
    page(6,
      `Ember's first laugh shook the mountain — and the frost melted instantly into a river of sparkling gemstones. The whole kingdom burst into bloom.`,
      `Dragon laughing, frost exploding into gemstones and flowers, kingdom seen through cave opening bursting into spring colour, joyful children's book art`,
      '💎'),
    page(7,
      `The king and queen declared ${cap(p.name)} Royal Friend of Dragons Forever. Ember flew them home on her back — a tiny dragon carrying one very proud adventurer.`,
      `Child riding tiny dragon flying over blooming fantasy kingdom at sunset, cheering crowds below, children's book illustration`,
      '👑'),
    page(8,
      `That night, snuggled at ${p.favoritePlace}, ${cap(p.name)} kept a small crystal Ember had given them. Friendship, they knew, is the most powerful magic of all.`,
      `Child cosy at ${p.favoritePlace} holding glowing crystal, small dragon silhouette outside window flying home, warm golden ending, children's book`,
      '💜'),
  ],
})

// ─── Ocean ───────────────────────────────────────────────────────────────────
const oceanTemplate: TemplateBuilder = (p) => ({
  childName: p.name,
  theme: 'ocean',
  title: `${cap(p.name)} and the Pearl of the Deep`,
  pages: [
    page(1, `At the edge of ${p.favoritePlace}, ${cap(p.name)} found a magic snorkel that let them breathe underwater. One big jump, and the whole ocean opened up!`, `Child jumping into sparkling ocean near ${p.favoritePlace}, magical glowing snorkel, fish and coral below, sunrays, children's book watercolour`, '🤿'),
    page(2, `A wise old sea turtle named Coral greeted them. "Our Great Pearl has been stolen by a grumpy anglerfish," she said, "and without it our reef is losing colour."`, `Wise sea turtle Coral with colourful shell talking to child underwater, fading coral reef in background, children's book style`, '🐢'),
    page(3, `${cap(p.name)} and Coral swam through forests of kelp and over valleys of rainbow fish. Coral told jokes the whole way — she reminded ${cap(p.name)} of ${p.bestFriend || 'their best friend'}.`, `Child and turtle swimming through magical kelp forest with rainbow fish, light filtering down, playful children's book illustration`, '🌊'),
    page(4, `The anglerfish lived in a dark trench that made ${cap(p.name)} think of ${p.fears || 'very dark places'}. But they remembered: being brave doesn't mean not being scared — it means going anyway.`, `Child swimming towards dark trench with anglerfish glow visible, determination on face, sea turtle beside, children's book art`, '🔦'),
    page(5, `The anglerfish was only grumpy because she had a sea-thorn stuck in her fin. ${cap(p.name)} carefully pulled it free. The fish burst into grateful happy tears — big salty ones.`, `Child carefully removing thorn from large anglerfish fin, transformation from scary to gentle, underwater children's book illustration`, '🐟'),
    page(6, `She returned the Pearl at once. Back at the reef, the colours exploded like fireworks — every creature celebrating with ${p.interests.join(', ') || 'joy and laughter'}.`, `Coral reef exploding back into vivid colour, pearl returning to throne, ocean creatures celebrating, child in centre, watercolour children's art`, '🪸'),
    page(7, `As a thank you, the whole reef taught ${cap(p.name)} a special bubble-dance. It was the silliest, happiest dance in the entire ocean.`, `Child and hundreds of sea creatures doing silly bubble dance, bubbles everywhere, pure joy, children's book illustration`, '💃'),
    page(8, `Surfacing at ${p.favoritePlace}, ${cap(p.name)} still heard the music. Sometimes at night they saw a gentle pearl-glow beneath the waves — Coral, saying goodnight.`, `Child at shore of ${p.favoritePlace} at dusk, gentle pearl glow under waves, magical children's book ending`, '🌊'),
  ],
})

// ─── Superheroes ─────────────────────────────────────────────────────────────
const superheroesTemplate: TemplateBuilder = (p) => ({
  childName: p.name,
  theme: 'superheroes',
  title: `${cap(p.name)}: The Super You`,
  pages: [
    page(1, `It started as a normal day at ${p.favoritePlace} when ${cap(p.name)} accidentally sat on a glowing seed. Suddenly — their sneakers sparked, their hair crackled with light, and they could jump REALLY high.`, `Child accidentally sitting on glowing seed at ${p.favoritePlace}, sparkling shoes, crackling light-hair, surprised face, children's book watercolour`, '⚡'),
    page(2, `A superhero mentor appeared — a retired hero named Silver who looked a little like ${p.bestFriend || 'someone familiar'}. "Every hero needs a superpower AND a super heart," Silver said.`, `Friendly silver-suited retired hero appearing to child, training montage beginning, children's book style`, '🦸'),
    page(3, `Training was hard: balance beams over pillows, catching water balloons mid-air, and remembering that ${p.interests.join(' and ') || 'their favourite things'} made them unique.`, `Fun superhero training montage, pillows, water balloons, child laughing, children's book illustration`, '🎯'),
    page(4, `Then the alarm! A shadow creature made of everyone's worries (it looked like ${p.fears || 'a dark cloud'}) was drifting toward the school.`, `Shadow creature approaching school building, child hero preparing to act, dramatic but child-safe children's book art`, '🌑'),
    page(5, `${cap(p.name)}'s power was unique: they could turn worries into laughter. They stood up, made the silliest face imaginable — and the shadow dissolved in giggles.`, `Child making super-silly face, shadow creature dissolving into giggles and confetti, children's book art`, '😂'),
    page(6, `The whole school cheered. Even the teachers did a little happy dance. ${cap(p.name)} got an honorary cape — purple with a golden star.`, `Child in purple cape with golden star, teachers and kids celebrating, confetti, children's book illustration`, '🎊'),
    page(7, `Silver reminded them: "You didn't need the seed. You were already the super you." ${cap(p.name)} smiled. That was the best superpower of all.`, `Mentor kneeling to child's level, warm moment, glowing hands, children's book warm illustration`, '💛'),
    page(8, `Back at ${p.favoritePlace} that evening, ${cap(p.name)} looked at the stars and knew — whenever a friend needed help, they'd be ready.`, `Child in cape at ${p.favoritePlace} looking at starry sky, silhouette of hero, warm cosy ending, children's book art`, '🌟'),
  ],
})

// ─── Jungle ──────────────────────────────────────────────────────────────────
const jungleTemplate: TemplateBuilder = (p) => ({
  childName: p.name,
  theme: 'jungle',
  title: `${cap(p.name)} and the Golden Compass`,
  pages: [
    page(1, `A golden compass arrived in the mail at ${p.favoritePlace} — it pointed not north, but toward adventure. The very next morning, ${cap(p.name)} was standing at the edge of a vast, humming jungle.`, `Child at edge of lush jungle holding golden glowing compass, ${p.favoritePlace} visible behind, morning light, children's book watercolour`, '🧭'),
    page(2, `A parrot named Biscuit swooped down and became their guide. Biscuit talked non-stop and loved ${p.interests[0] || 'everything'} just as much as ${cap(p.name)} did.`, `Colourful parrot landing on child's shoulder, lush jungle path ahead, chatty parrot expressions, children's book illustration`, '🦜'),
    page(3, `They crossed a vine bridge over a river of hippos (who were actually very polite), climbed a tree of fireflies, and found clues carved into ancient stones.`, `Child crossing vine bridge over river with polite hippos, firefly tree, ancient stone clues, adventure children's book art`, '🌿'),
    page(4, `A rumbling filled the jungle — it was the sound that sounded like ${p.fears || 'something scary'}. But Biscuit said "That's just the jungle breathing. It's saying hello."`, `Jungle rumbling with mysterious sounds, parrot explaining calmly, child feeling braver, children's book illustration`, '🌳'),
    page(5, `The treasure: a hidden village where animals and kids lived together. They had lost their source of music — a crystal drum. ${cap(p.name)} found it buried under a fern.`, `Magical hidden village of kids and animals, crystal drum found, celebration beginning, warm children's book watercolour`, '🥁'),
    page(6, `Music filled the jungle again. Every creature danced — even the shy ones. ${cap(p.name)} danced with ${p.bestFriend || 'a new friend'} until their feet ached happily.`, `Jungle dance party, all animals and kids dancing, music notes in air, joy everywhere, children's book illustration`, '🎶'),
    page(7, `The village gave ${cap(p.name)} the compass to keep — to always find new adventures. Biscuit promised to visit whenever the window was open.`, `Child given compass by village elders, parrot promising to return, fond farewell, children's book art`, '🎁'),
    page(8, `At ${p.favoritePlace}, ${cap(p.name)} placed the compass on their shelf. Sometimes it pointed straight to their heart — the real source of every adventure.`, `Child's bedroom shelf with glowing compass, ${p.favoritePlace} outside window, warm sunset ending, children's book style`, '🏠'),
  ],
})

// ─── Magic School ─────────────────────────────────────────────────────────────
const magicSchoolTemplate: TemplateBuilder = (p) => ({
  childName: p.name,
  theme: 'magic-school',
  title: `${cap(p.name)}'s First Day at Sparkholm Academy`,
  pages: [
    page(1, `An owl delivered the letter the morning ${cap(p.name)} was at ${p.favoritePlace}. The seal sparkled gold: "You are invited to Sparkholm Academy — School of Wonders." First day jitters and excitement mixed together.`, `Owl delivering golden letter to child at ${p.favoritePlace}, magical sparkling seal, morning light, children's book watercolour`, '🦉'),
    page(2, `The school floated on a cloud above the town. A rainbow staircase led up to the main doors, where a headmistress in a starry robe welcomed every student.`, `Floating school on cloud, rainbow staircase, child climbing up, headmistress waving, children's book illustration`, '🏫'),
    page(3, `${cap(p.name)}'s first class was Spell of ${p.interests[0] ? cap(p.interests[0]) : 'Imagination'}. Everyone got a wand that matched their personality — ${cap(p.name)}'s glowed in their favourite colours.`, `Classroom full of kids with glowing personalised wands, teacher demonstrating spell, magical sparks, children's book art`, '🪄'),
    page(4, `A mischievous spell went wrong during lunch — all the food started floating. It reminded ${cap(p.name)} of when they had worried about ${p.fears || 'things going wrong'}, but everyone just laughed and caught their sandwiches mid-air.`, `Floating food in school cafeteria, kids and child laughing, catching sandwiches, funny magical chaos, children's book illustration`, '🥪'),
    page(5, `The afternoon challenge: fix a broken spell clock that kept the school's magic running. Only someone who truly understood ${p.interests.join(' and ') || 'what mattered'} could crack the code.`, `Large magical broken spell clock, child studying it closely, magical symbols around, children's book art`, '⏰'),
    page(6, `${cap(p.name)} solved it in minutes — because the clock was built around things they already loved! The school's magic roared back to life.`, `Spell clock roaring back to life, magic exploding in colour, whole school cheering, child triumphant centre, children's book illustration`, '🎆'),
    page(7, `By evening, ${cap(p.name)} had made a whole new circle of magical friends — including one who reminded them exactly of ${p.bestFriend || 'their best friend at home'}.`, `Group of diverse magical kids celebrating friendship, child in centre, golden evening light, children's book art`, '🤝'),
    page(8, `Drifting home on the rainbow staircase, ${cap(p.name)} looked forward to every day ahead. At Sparkholm — and in life — the best magic is the kind you make yourself.`, `Child walking down rainbow staircase from floating school at sunset, looking forward happily, beautiful children's book ending`, '🌈'),
  ],
})

// ─── Registry ────────────────────────────────────────────────────────────────

const TEMPLATES: Record<StoryTheme, TemplateBuilder> = {
  dinosaurs:      dinosaursTemplate,
  space:          spaceTemplate,
  fantasy:        fantasyTemplate,
  ocean:          oceanTemplate,
  superheroes:    superheroesTemplate,
  jungle:         jungleTemplate,
  'magic-school': magicSchoolTemplate,
}

export function generateStory(profile: ChildProfile): Story {
  const builder = TEMPLATES[profile.theme]
  const base = builder(profile)
  return {
    ...base,
    id: `story-${Date.now()}`,
    createdAt: new Date(),
    status: 'generating',
  }
}

export { PAGES_PER_STORY }
