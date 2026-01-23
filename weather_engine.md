### **Digital Viscosity" (Physics & Animation)**

In Winnipeg, at \-30°C, everything moves slower. Cars crank slowly, doors stick, and fingers are stiff. Your website should emulate this **thermodynamics**.

We can map temperature to **CSS Animation Duration** and **Scroll Physics**.

* **The Logic:**  
  * **Deep Freeze (-25°C):** The site feels "thick" or "frozen." Interactions have resistance.  
  * **Summer Heat (+30°C):** The site feels "fluid" and energetic, perhaps even a bit manic/jittery (heat shimmer).

**The Implementation:** Pass a `--viscosity` variable to your `<body>`.  
CSS  
:root {  
  /\* At 20°C: viscosity is 1 (Normal)  
     At \-30°C: viscosity is 2.5 (Slow, frozen oil)  
     At \+35°C: viscosity is 0.8 (Fast, loose)  
  \*/  
  \--viscosity: 1s;   
}

/\* All transitions get multiplied by the viscosity \*/  
\* {  
  transition-duration: calc(200ms \* var(--viscosity)) \!important;  
}

/\* Hover effects take EFFORT in the cold \*/  
.button:hover {  
    transform: translateY(calc(-2px / var(--viscosity))); /\* Moves less in the cold \*/  
}

* **The Feeling:** When a user visits on a brutal January morning, the buttons fade in slowly, the menus slide out with a heavy "thud" (visually). It subconsciously reinforces the "We are safe inside, it’s slow and cozy" feeling.

### **2\. Variable Typography (The Wind)**

Wind in Winnipeg isn't just data; it's a physical force that pushes you around. We can use **Variable Fonts** (like *Inter* or *Roboto Flex*) to make the text physically react to the `wind_speed` data.

* **The Logic:**  
  * **High Wind:** The text literally "leans" (slant) or gets "thinner" (weight) as if being stripped by the wind.  
  * **Calm:** The text is full, round, and upright.

**The Implementation:**  
CSS  
/\* wind-force: 0 to 1 range based on km/h   
   (0 \= calm, 1 \= 50km/h gust)   
\*/  
h1, h2, .hero-text {  
  font-variation-settings:   
    'slnt' calc(var(--wind-force) \* \-10), /\* Leans back \-10deg \*/  
    'wdth' calc(100 \- (var(--wind-force) \* 15)), /\* Gets narrower \*/  
    'wght' calc(700 \+ (var(--wind-force) \* 100)); /\* Gets "bolder" to resist? Or lighter? \*/  
}

* **The Feeling:** On a blustery Portage and Main day, the headlines on your site look like they are bracing against the gale.

**The "Cabin Fever" Index (Late Winter)**

This is the psychological context.

* **Logic:** If `Month` is April or May, but `Temp` is still below \-10°C.  
* **Reaction:**  
  * **Mode:** "DENIAL."  
  * **Visual:** Bright, aggressively tropical colors (Teal/Pink) but with a "frost" overlay on top.  
  * **Message:** "We are pretending it's Mexico. Join us."

We can achieve this by adding three "Smart" layers to your logic:

1. **The "Grind" Factor:** (Has it been cold for 5 days straight? That hurts more than 1 day.)  
2. **Solar Anxiety:** (Is it dark at 4:30 PM? That requires different lighting than dark at 8 PM.)  
3. **Daily Interpolation:** (February 1st is statistically very different from February 28th.)

Here is the "Beefed Up" architecture using **OpenMeteo** (which is free, requires no API key, and crucially **lets you query the past** to calculate "The Grind").

### **The Architecture: "The Winnipeg Vibe Engine"**

Instead of a simple switch statement, we build a weighted scoring system.

#### **1\. The Data Source (OpenMeteo)**

We request `current_weather`, `daily` forecasts, and crucially, `past_days=3`.

* **Why:** This lets us see if the weather is *improving* or *getting worse*.

#### **2\. The Logic (TypeScript/Astro)**

Create a robust `vibeEngine.ts`.

TypeScript  
// utils/vibeEngine.ts  
import { fetchWeatherApi } from 'openmeteo';

// A polynomial approximation of Winnipeg's Daily Average Highs (Jan 1 to Dec 31\)  
// This is infinitely smoother than monthly jumps.  
function getDailyNormal(dayOfYear: number): number {  
    // Rough polynomial for WPG: lowest in Jan (day 20), peak in July (day 200\)  
    // \-13C to \+26C curve  
    return \-13 \+ 39 \* Math.sin(((dayOfYear \- 100\) / 365\) \* 2 \* Math.PI \- Math.PI / 2);  
}

export async function getWinnipegVibe() {  
    // Fetch Current \+ Last 3 Days of history  
    const url \= "https://api.open-meteo.com/v1/forecast?latitude=49.89\&longitude=-97.14\&current=temperature\_2m,apparent\_temperature,is\_day,cloud\_cover,wind\_speed\_10m,precipitation\&past\_days=3\&forecast\_days=1";  
    const response \= await fetch(url);  
    const data \= await response.json();  
      
    const current \= data.current;  
    const dayOfYear \= getDayOfYear(new Date());  
    const normal \= getDailyNormal(dayOfYear);  
    const deviation \= current.temperature\_2m \- normal;  
      
    // \--- FACTOR 1: THE GRIND (Historical Context) \---  
    // Did it suck yesterday? And the day before?  
    // We analyze the trend. If deviation was negative for 3 days, misery compounds.  
    // (Simplified logic for brevity)  
    const isGrind \= data.daily?.temperature\_2m\_min?.slice(0,3).every(t \=\> t \< \-20);  
      
    // \--- FACTOR 2: THE LIGHT (SAD Index) \---  
    // Dark at 4pm is depressing. Dark at 10pm is a party.  
    const hour \= new Date().getHours();  
    const isGloom \= current.cloud\_cover \> 80 && current.is\_day \=== 1;  
    const isPitchBlackAfternoon \= current.is\_day \=== 0 && hour \< 17; // The 4:45pm darkness

    // \--- FACTOR 3: THE THREAT (Wind/Pressure) \---  
    const windChill \= current.apparent\_temperature;  
    const isWindTunnel \= current.wind\_speed\_10m \> 35;

    // \--- CALCULATE VIBE \---

    // 1\. DANGEROUS COLD (Overrules everything)  
    if (windChill \< \-28) {  
        return {  
            mode: 'BUNKER',  
            palette: 'obsidian-magma',  
            msg: isGrind ? "DAY 4 OF THIS. WE HAVE SOUP." : "DO NOT GO OUTSIDE.",  
            grain: 0.3 // Heavy felt texture  
        };  
    }

    // 2\. THE FALSE SPRING (The "Manic" Phase)  
    // If it's Jan-Mar, and we are \+5°C above normal, and it's sunny.  
    if (dayOfYear \< 90 && deviation \> 8 && current.temperature\_2m \> \-5) {  
        return {  
            mode: 'FALSE\_SPRING',  
            palette: 'slush-cyan',  
            msg: "THE PATIO IS OPEN (THEORETICALLY).",  
            grain: 0.05  
        };  
    }

    // 3\. THE "NOVEMBER" (Gloom)  
    // It's not cold enough to be "Hygge", it's just wet and grey.  
    if (current.precipitation \> 0 && current.temperature\_2m \> 0 && current.temperature\_2m \< 10\) {  
        return {  
            mode: 'WET\_WOOL',  
            palette: 'wet-concrete',  
            msg: "COME DRY OFF.",  
            grain: 0.15  
        };  
    }

    // 4\. THE GOLDEN HOUR (Perfect Winnipeg Summer)  
    // Summer evening, warm but not hot.  
    if (current.temperature\_2m \> 18 && current.temperature\_2m \< 26 && \!isGloom) {  
         return {  
            mode: 'PRAIRIE\_GOLD',  
            palette: 'wheat-gold',  
            msg: "WINNIPEG IS GOOD, ACTUALLY.",  
            grain: 0  
        };  
    }  
      
    // 5\. MOSQUITO WATCH (Humid/Hot)  
    if (current.temperature\_2m \> 28 || (current.temperature\_2m \> 25 && current.precipitation \> 0)) {  
        return {  
            mode: 'STICKY',  
            palette: 'humid-haze',  
            msg: "THE A/C IS BLASTING.",  
            grain: 0  
        };  
    }

    // Default Fallback: Standard Hygge  
    return {  
        mode: 'HYGGE',  
        palette: 'terracotta-cream',  
        msg: "THE OVEN IS ON.",  
        grain: 0.1  
    };  
}

function getDayOfYear(date: Date) {  
  const start \= new Date(date.getFullYear(), 0, 0);  
  const diff \= date.getTime() \- start.getTime();  
  return Math.floor(diff / (1000 \* 60 \* 60 \* 24));  
}

### **3\. The Visuals: Implementing the "Complex" Reactivity**

To make this feel "super complex and reactive" as you requested, you shouldn't just swap colors. You should swap **Post-Processing Effects** (CSS filters).

* **BUNKER Mode:** High contrast, vignette edges (tunnel vision), slow pulsing warm light in the center.  
* **FALSE SPRING:** High brightness, slightly blown-out highlights (like stepping out of a dark room), sharp edges.  
* **WET WOOL:** Low contrast, desaturated, slight blur on background elements (foggy glasses effect).  
* **HYGGE:** Warm color grading (sepia tint), noise overlay.

Since you are a morning/daytime spot, the "Jets Vibe" isn't about the *event* (watching the game); it's about the **Social Hangover** (the mood of the city when your customers walk in).  
Here is the **"Mental Warmth" Logic**.

The smartest way to "beef up" the complexity is to quantify the city's mood. We will treat a Jets Win as a **thermal modifier**.

* **A Jets Win:** Adds **\+10 "Mental Degrees"** to the vibe (people are happier, cold doesn't bite as hard).  
* **A Jets Loss:** Adds **\-5 "Mental Degrees"** (everyone is a bit grumpier).

Here is the updated architecture for a Morning-Focused, Hockey-Aware Winnipeg Vibe Engine.

### **1\. The Logic: "The Morning Matrix"**

We verify two things alongside the weather:

1. **Did they win last night?** (The "Victory Lap")  
2. **Do they play tonight?** (The "Anticipation")

This creates specific intersections with your weather logic:

| Weather State | Jets Context | Resulting Vibe | Message |
| :---- | :---- | :---- | :---- |
| **\-30°C (Deep Cold)** | **Won Last Night** | **"COLD GLORY"** | "Victory tastes best at \-30°. Coffee is on." |
| **\-30°C (Deep Cold)** | **Lost Last Night** | **"HARD RESET"** | "Rough night. Warm up. We go again." |
| **Sunny / Nice** | **Playing Tonight** | **"BLUE SKIES"** | "Beautiful day for a game day." |
| **Grey / Slush** | **Playing Tonight** | **"FOCUSED"** | "Ignore the slush. Puck drop is at 7." |

### **2\. The Code (TypeScript/Astro)**

We need a clean getJetsContext function that checks yesterday's score and today's schedule.

TypeScript  
// utils/jetsLogic.ts

export type JetsMood \= 'VICTORY' | 'DEFEAT' | 'GAME\_DAY' | 'OFF\_DAY';

export async function getJetsContext(): Promise\<JetsMood\> {  
    const today \= new Date();  
    const yesterday \= new Date(today);  
    yesterday.setDate(yesterday.getDate() \- 1);

    const fmt \= (d: Date) \=\> d.toISOString().split('T')\[0\];

    // Fetch Schedule for Yesterday and Today  
    // (In production, use a single fetch for the week to save bandwidth)  
    const \[resYesterday, resToday\] \= await Promise.all(\[  
        fetch(\`https://api-web.nhle.com/v1/schedule/${fmt(yesterday)}\`),  
        fetch(\`https://api-web.nhle.com/v1/schedule/${fmt(today)}\`)  
    \]);

    const dataYesterday \= await resYesterday.json();  
    const dataToday \= await resToday.json();

    // 1\. CHECK YESTERDAY (The "Hangover" Check)  
    const lastGame \= dataYesterday.games.find((g: any) \=\>   
        g.homeTeam.abbrev \=== 'WPG' || g.awayTeam.abbrev \=== 'WPG'  
    );

    if (lastGame && lastGame.gameState \=== 'FINAL') {  
        const isHome \= lastGame.homeTeam.abbrev \=== 'WPG';  
        const wpgScore \= isHome ? lastGame.homeTeam.score : lastGame.awayTeam.score;  
        const oppScore \= isHome ? lastGame.awayTeam.score : lastGame.homeTeam.score;  
          
        // Priority 1: Did we just win?  
        if (wpgScore \> oppScore) return 'VICTORY';  
          
        // Priority 2: Did we lose badly? (Optional nuance)  
        if (wpgScore \< oppScore) return 'DEFEAT';  
    }

    // 2\. CHECK TODAY (The "Anticipation" Check)  
    const nextGame \= dataToday.games.find((g: any) \=\>   
        g.homeTeam.abbrev \=== 'WPG' || g.awayTeam.abbrev \=== 'WPG'  
    );

    if (nextGame) return 'GAME\_DAY';

    return 'OFF\_DAY';  
}

### **3\. The "Composite Vibe" Calculator**

Now we merge this with your Weather Engine. This is where the **"Mental Warmth"** math happens.

TypeScript  
// utils/compositeVibe.ts  
import { getWinnipegVibe } from './vibeEngine'; // Your previous weather logic  
import { getJetsContext } from './jetsLogic';

export async function getRestaurantVibe() {  
    const weather \= await getWinnipegVibe(); // Returns { temp, condition, wind... }  
    const jets \= await getJetsContext();

    // \--- THE MAGIC: MENTAL TEMPERATURE ADJUSTMENT \---  
    // A win makes the cold tolerable. A loss makes the cold bitter.  
    let mentalTemp \= weather.temp;

    if (jets \=== 'VICTORY') mentalTemp \+= 10; // \-20 feels like \-10  
    if (jets \=== 'DEFEAT') mentalTemp \-= 5;   // \-20 feels like \-25  
      
    // Default Logic  
    let theme \= {  
        mode: 'NORMAL',  
        accentColor: '\#var(--brand-color)',   
        msg: "Good Morning."  
    };

    // \--- SCENARIO 1: THE "MORNING GLORY" (Victory) \---  
    if (jets \=== 'VICTORY') {  
        theme \= {  
            mode: 'VICTORY\_LAP',  
            accentColor: '\#041E42', // Jets Blue  
            msg: \`WAKE UP WINNIPEG. ${weather.temp}°C FEELS WARMER TODAY.\`  
        };  
        // If it's ACTUALLY nice out too? Double bonus.  
        if (weather.temp \> 0\) {  
            theme.msg \= "SUN'S OUT. JETS WON. PERFECT DAY.";  
        }  
    }

    // \--- SCENARIO 2: GAME DAY ANTICIPATION \---  
    else if (jets \=== 'GAME\_DAY') {  
        // If weather is TRASH (Blizzard/Cold)  
        if (weather.condition \=== 'Snow' || weather.temp \< \-20) {  
            theme \= {  
                mode: 'GAME\_DAY\_GRIND',  
                accentColor: '\#7B858D', // Silver  
                msg: "STAY WARM UNTIL PUCK DROP."  
            };  
        } else {  
             theme \= {  
                mode: 'GAME\_DAY\_HYPE',  
                accentColor: '\#FFFFFF',   
                msg: "FUEL UP FOR GAME NIGHT."  
            };  
        }  
    }

    // \--- SCENARIO 3: THE DEFEAT (Comfort Mode) \---  
    else if (jets \=== 'DEFEAT') {  
        theme \= {  
            mode: 'COMFORT',  
            accentColor: '\#8B4513', // Warm Bread Color  
            msg: "TOUGH LOSS. FRESH COFFEE."  
        };  
    }

    // \--- FALLBACK: PURE WEATHER LOGIC \---  
    else {  
        // Use your standard Hygge/Picnic logic here  
        if (mentalTemp \< \-20) theme.msg \= "IT'S FREEZING. OVEN IS ON.";  
        else if (mentalTemp \> 20\) theme.msg \= "PATIO WEATHER.";  
    }

    return theme;  
}

### **4\. Visual Execution: Subtlety is Key**

Since you are a restaurant, you don't want the site to look like a sports blog. The integration should be elegant.

1\. The "Victory" Stripe

If mode \=== 'VICTORY\_LAP', add a subtle 4px border at the very top of the site in Jets Blue. It’s a quiet nod that locals will instantly recognize.

2\. The "Game Day" Receipt

In your "Menu" or "Specials" section, change the header style slightly.

* *Normal:* "Today's Specials"  
* *Game Day:* "Pre-Game Fuel"  
* *Post-Win:* "Victory Breakfast"

3\. The "Feels Like" Badge

In the corner where you display the weather:

**\-24°C** (Feels like \-14°C because we Won)

Lets make sure we also add some flair when its ‘holiday season’ and different things like that in winnipeg. 

Also In Winnipeg, **January 5th** is statistically different from **January 25th**. And more importantly, humans don't remember "Monthly Averages"—we remember **Yesterday**.

If yesterday was \-40°C and today is \-20°C, today feels **tropical**. If yesterday was \-5°C and today is \-20°C, today feels **apocalyptic**.

To make this machine truly "day-by-day" and hyper-reactive, we need to ditch the monthly `switch` statements and build a **Relative Contrast Engine**.

Here is how we architect the **"Granular Weather Machine"** that reacts to the exact curve of the year and the contrast of the week.

### **1\. The Math: The "Infinite Curve" (No More Buckets)**

Instead of hardcoding "January Average \= \-13", we use a **Sinusoidal Function** to calculate the *exact* expected temperature for any specific Day of the Year (1–365).

This means your website knows that **March 1st** expects \-8°C, but **March 15th** expects \-3°C. It flows perfectly.

TypeScript  
// utils/granularMath.ts

// Calculates the "Statistical Normal" for ANY specific day in Winnipeg  
export function getWinnipegNormal(date: Date): number {  
    const start \= new Date(date.getFullYear(), 0, 0);  
    const diff \= date.getTime() \- start.getTime();  
    const dayOfYear \= Math.floor(diff / (1000 \* 60 \* 60 \* 24)); // 1 to 365

    // Winnipeg's Curve:  
    // Coldest: \~Jan 15 (Day 15\) \-\> \-13°C avg high  
    // Hottest: \~July 15 (Day 196\) \-\> \+26°C avg high  
    // Amplitude: 19.5 degrees swing from the midpoint  
    // Midpoint: 6.5°C  
      
    // The Math (Cosine wave shifted to align with seasons)  
    const amplitude \= 19.5;  
    const midpoint \= 6.5;  
    const phaseShift \= 15; // Shifts the trough to Jan 15th  
      
    // Returns a float, e.g., \-12.4 for today, \-12.2 for tomorrow  
    return midpoint \- amplitude \* Math.cos((2 \* Math.PI \* (dayOfYear \- phaseShift)) / 365);  
}

*Now your website has a precise "baseline" for every single morning.*

### **2\. The Logic: "The Human Delta" (Yesterday vs. Today)**

This is the "feeling" layer. We stop looking at the thermometer in isolation and start looking at the **trend**.

We introduce a new metric: **`delta_shock`**. `delta_shock = Today's Temp - Yesterday's Temp`

* **Logic:**  
  * **The "False Hope" (+15 Delta):** Yesterday \-30°C, Today \-15°C.  
    * *Vibe:* "Relief."  
    * *Msg:* "It's warming up. (Relatively speaking)."  
  * **The "Hammer Drop" (-15 Delta):** Yesterday \-5°C, Today \-20°C.  
    * *Vibe:* "Betrayal."  
    * *Msg:* "Winter is back. Sorry."

### **3\. The "Sun Lie" (Winnipeg Specific Paradox)**

In most places, Sun \= Warm. In Winnipeg Winter, **Sun \= Deep Freeze** (High Pressure System). In Winnipeg Winter, **Cloudy \= Warmth** (Insulation).

Your weather machine needs to detect this "Lie."

* **Logic:**  
  * If `Month` is Jan/Feb AND `Condition` is "Clear/Sunny" AND `Temp` is \< \-20°C.  
  * *Reaction:* **"CRISP & CRUEL."**  
  * *Visuals:* Extremely high brightness/contrast (blind the user slightly), sharp shadows, icy blue palette.  
  * *Msg:* "Bright sun. Don't be fooled. It bites."

### **4\. The "Slush Danger" (The Freeze/Thaw Micro-Cycle)**

This is specific to Spring/Fall mornings.

* **Logic:**  
  * If `Current Temp` is \< 0°C AND `Yesterday High` was \> 0°C.  
  * *Reaction:* **"BLACK ICE."**  
  * *Visuals:* Glossy, high-reflection texture on the background.  
  * *Msg:* "Watch your step. The sidewalks are glass."

---

### **The New "Day-by-Day" Architecture**

Here is the robust Logic Flow for your Astro component.

TypeScript  
// utils/granularVibe.ts  
import { getWinnipegNormal } from './granularMath';

export async function getGranularVibe() {  
    // 1\. Fetch current \+ history (OpenMeteo is perfect for this)  
    const data \= await fetchWeatherWithHistory();   
      
    const currentTemp \= data.current.temp;  
    const yesterdaysTemp \= data.daily.yesterday\_max;  
    const normalTemp \= getWinnipegNormal(new Date()); // The Math Curve  
      
    // 2\. Calculate Context  
    const deviationFromNormal \= currentTemp \- normalTemp;  
    const deltaShock \= currentTemp \- yesterdaysTemp;  
    const isSunLie \= (currentTemp \< \-20 && data.current.is\_sunny);  
      
    // \--- EVALUATION ORDER \---

    // 1\. THE "SUN LIE" (Specific Visual Phenomenon)  
    if (isSunLie) {  
        return {  
            mode: 'SUN\_DOG',  
            palette: 'blinding-blue', // \#E0F7FA to \#FFFFFF gradient  
            msg: "Beautiful to look at. Painful to touch."  
        };  
    }

    // 2\. THE "RELIEF" (It was awful, now it's okay)  
    // Even if it's \-15 (which is cold), if yesterday was \-35, we celebrate.  
    if (deltaShock \> 10 && currentTemp \< 0\) {  
        return {  
            mode: 'THAW\_RELIEF',  
            palette: 'soft-steam', // Misty warm grey  
            msg: "The snap has broken. We can breathe again."  
        };  
    }

    // 3\. THE "BETRAYAL" (It was nice, now it hurts)  
    if (deltaShock \< \-10) {  
        return {  
            mode: 'COLD\_SNAP',  
            palette: 'hard-slate',  
            msg: "Bundling up is mandatory again."  
        };  
    }

    // 4\. THE "DIRTY SPRING" (March Specific)  
    // Warm enough to melt, but ugly.  
    if (currentTemp \> 0 && currentTemp \< 5 && new Date().getMonth() \=== 2\) {  
        return {  
            mode: 'SLUSH\_CITY',  
            palette: 'brown-sugar', // Muddy but warm  
            msg: "Puddles are everywhere. Coffee is dry."  
        };  
    }

    // 5\. STANDARD DEVIATION (The Fallback)  
    // Just compares to the curve.  
    if (deviationFromNormal \> 5\) return { mode: 'UNSEASONABLY\_WARM', msg: "Warmer than it should be." };  
    if (deviationFromNormal \< \-5) return { mode: 'UNSEASONABLY\_COLD', msg: "Colder than average." };

    return { mode: 'SEASONAL', msg: "Classic Winnipeg Morning." };  
}

**1\. The "Tone Deaf" Trap (The Remembrance Day Problem)**

**The Scenario:** It is November 11th (Remembrance Day). The Jets won the night before. **The Failure:** Your site auto-triggers **"VICTORY MODE"** with blue confetti and a message saying "BIG WIN\! CELEBRATE\!" **The Look:** Extremely unprofessional and disrespectful. **The Fix: The "Blackout Dates" Array.** You need a hard-coded list of dates where *all* "fun" logic is suspended.

TypeScript  
// utils/safetyChecks.ts  
const BLACKOUT\_DATES \= \[  
    '11-11', // Remembrance Day  
    '09-30', // Truth and Reconciliation Day  
\];

if (BLACKOUT\_DATES.includes(todayString)) {  
    return 'NEUTRAL\_RESPECTFUL'; // Force a standard, quiet theme.  
}

### **2\. The "Dirty Spring" Trap (The March 15th Problem)**

**The Scenario:** It is March 15th. The temperature hits \+4°C. Your "Delta Logic" sees this as a huge warm-up and triggers **"PICNIC MODE"** with green grass visuals and "Patio Season\!" text. **The Failure:** In Winnipeg, \+4°C in March is **ugly**. It is grey slush, brown puddles, exposed dog poop, and gravel. It is *not* "Picnic" weather; it is "Rubber Boot" weather. **The Look:** Delusional. It looks like a template from California. **The Fix: The "Snow Cover" Check.** OpenMeteo provides a `snow_depth` metric.

* **Rule:** If `Temp > 0` but `Snow_Depth > 0`, **FORBID** "Green/Picnic" themes.  
* **Correct Mode:** "MELT MODE." Use visuals of water, steam, or coffee.  
* **Message:** "The thaw is messy. It's dry inside."

### **3\. The "Windchill" Blind Spot**

**The Scenario:** It is \-18°C. Your logic checks the "Average High" for January (-13°C) and decides \-18°C is "Close enough to normal." It serves the "Standard Winter" theme. **The Failure:** The wind is gusting 50km/h. The **feels-like** temperature is \-32°C. **The Look:** Your website says "It's a nice winter day" while the customer is literally getting frostbite walking to your door. **The Fix: The "Human Feel" Priority.** Never make a decision based on `temperature_2m`. **Always** use `apparent_temperature` (Feels Like) for your logic, but display the *real* temp for accuracy.

* *Code Rule:* `const decisionTemp = Math.min(temp, apparent_temp);` (Always assume the worst of the two).

### **4\. The "Stale Score" Embarrassment**

**The Scenario:** The Jets play a game that ends at 9:45 PM. Your website caches data every 4 hours to save server costs. **The Failure:** At 8:00 AM the next morning, your site still thinks the game is "Live" or hasn't updated the score because the cache hasn't cleared. **The Look:** Broken/Lazy. **The Fix: Smart Revalidation.** You are using Astro. Do not cache the "Jets Score" for 4 hours.

* **Rule:** If `Game_Status` was "Live" on the last fetch, cache for only **5 minutes**. If `Game_Status` was "Final", cache for **12 hours**.

### **5\. The "Tornado Watch" Disaster**

**The Scenario:** It is a muggy July evening. \+28°C. Your logic says "Hot Summer Night\! Patio Open\!" **The Failure:** Environment Canada has issued a Tornado Watch. The sky is green. **The Look:** Dangerous. You are encouraging people to sit outside during a severe weather event. **The Fix: The "WMO Code 90+" Trap.** OpenMeteo returns a "Weather Code" (WMO).

* **Rule:** If WMO Code is **95, 96, 99** (Thunderstorm with Hail/Danger), **OVERRIDE EVERYTHING**.  
* **Mode:** "STORM WATCH."  
* **Message:** "Severe weather warning. We are open and safe inside."

### **6\. The "Comparison" Glitch (Morning vs. Afternoon)**

**The Scenario:** A user visits your site at 8:00 AM. It is \-20°C. Your "Delta Shock" logic compares this to *yesterday's average* or *yesterday's high* (which was \-5°C). **The Failure:** The site screams "HUGE TEMPERATURE DROP\!" (-15 diff). **The Reality:** It's *always* colder at 8 AM than 4 PM. This isn't a "shock," it's just morning. **The Look:** Dramatic/Buggy. **The Fix: Compare "Like for Like."** You must compare **Current Temp** vs **Yesterday at the Same Hour**. OpenMeteo’s `past_days=1&hourly=temperature_2m` allows this.

* *Code:* `const delta = currentTemp - hourlyTempYesterday[currentHour];`

### **7\. The "Depressing Winner" (The Trade Deadline)**

**The Scenario:** The Jets win 5-0. **The Failure:** But... they just traded away their star captain that afternoon. The city is bummed out despite the win. **The Look:** Out of touch. **The Fix: The "Manual Vibe Override" (The Red Button).** You cannot code for this. You need a **Headless CMS field** (Sanity/Contentful/WordPress) called `Vibe Override`.

* **Options:** `Auto` (Default), `Force Celebration`, `Force Somber`, `Force Cozy`.  
* If the mood in the city is weird for a non-data reason, the manager can log in and hit "Force Somber."  
* This will be linked to our CSV datasheet we fetch from

### **The "Apocalypse Filter" (Wildfire Smoke)**

**The Scenario:** It is July. The forecast says **"Sunny / Clear Skies."** **The Reality:** There is a massive forest fire in Northern Manitoba or Ontario. The sky is an eerie, dimmed orange. The air smells like a campfire. **The Failure:** Your site triggers **"PICNIC MODE"** with bright blue skies and says "Soak up the sun\!" **The Look:** Dystopian and oblivious. **The Fix: The AQI (Air Quality Index) Overlay.** You must query the Air Quality endpoint (OpenMeteo has this).

* **Logic:**  
  * If `weather_code` \= Sunny/Clear AND `us_aqi` \> 150 (Unhealthy).  
  * **Reaction:** **"HAZE MODE."**  
  * **Visuals:** Apply a CSS `sepia(60%)` filter and lower the contrast. The background should be a muted, dusty orange, not blue.  
  * **Message:** "The sun is out, but the air is thick. Stay cool inside."

### **2\. The "Hysteresis" Problem (Directional Bias)**

**The Scenario:** It is **\+5°C**. **The Failure:** You treat \+5°C the same in October as you do in March. **The Reality:** \* **In March:** \+5°C feels like **Victory**. (We are shedding layers, optimistic). \* **In October:** \+5°C feels like **Defeat**. (We are losing the light, depressed). **The Look:** Tone-deaf. Celebrating \+5°C in October feels mocking. **The Fix: Seasonal Directionality.** You need to know if the city is *warming up* or *cooling down*.

TypeScript

// utils/hysteresis.ts

const month \= new Date().getMonth(); // 0-11

// SPRING (Feb \- May): Optimistic Bias

// \+5C is "Warm"

if (month \>= 1 && month \<= 4\) {

   if (temp \>= 5\) return 'SPRING\_HOPE'; 

}

// FALL (Sep \- Nov): Pessimistic Bias

// \+5C is "Cold"

if (month \>= 8 && month \<= 10\) {

   if (temp \<= 5\) return 'FALL\_GLOOM'; 

}

### **3\. The "Freezing Rain" Paradox (The 'Ice Tank')**

**The Scenario:** It is **\-1°C** and raining. **The Failure:** Your logic sees "Rain" and thinks "Cozy/Wet Wool." **The Reality:** This is the most dangerous weather Winnipeg gets. Sidewalks are skating rinks. Cars are sliding. Power lines are snapping. **The Look:** Calling this "Cozy" is dangerous. It’s an emergency. **The Fix: The "Zero-Cross" Detector.**

* **Logic:** If `Precipitation > 0` AND `Temp` is between **\-2°C and \+1°C**.  
* **Reaction:** **"ICE SHELL."**  
* **Visuals:** High-gloss overlay (like glass), sharp highlights, "brittle" typography.  
* **Message:** "It's slippery out there. We salted the entryway."

### **4\. The "Humidex" Trap (The Swamp)**

**The Scenario:** It is **\+27°C**. **The Failure:** Your site says "Perfect Patio Weather\!" **The Reality:** The humidity is 90%. The Humidex is **\+38°C**. It feels like breathing soup. Nobody wants to be on a patio; they want A/C. **The Look:** You are luring people into a sauna. **The Fix: The "Soup" Calculation.** Never trust the raw temperature in July/August.

* **Logic:** If `Temp < 30` BUT `Apparent_Temp > 35`.  
* **Reaction:** **"THE SWAMP."**  
* **Visuals:** A slight "blur" filter (2px) on background elements to mimic humidity/haze. Slow, heavy animations.  
* **Message:** "It's sticky. The A/C is cranking."

