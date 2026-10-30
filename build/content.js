// Milestone content. Plain English (about CEFR B1). [[word]] or [[shown text|glossary key]] marks glossary terms.
// Fields: date (ISO, used for map state), when (display), states (highlighted), acq (new acquisition id),
// place {name, lon, lat}, what, why[], person{}, progress, promise, cost, also.

const STATES = {
  DE: ['Delaware', '1787-12-07'], PA: ['Pennsylvania', '1787-12-12'], NJ: ['New Jersey', '1787-12-18'],
  GA: ['Georgia', '1788-01-02'], CT: ['Connecticut', '1788-01-09'], MA: ['Massachusetts', '1788-02-06'],
  MD: ['Maryland', '1788-04-28'], SC: ['South Carolina', '1788-05-23'], NH: ['New Hampshire', '1788-06-21'],
  VA: ['Virginia', '1788-06-25'], NY: ['New York', '1788-07-26'], NC: ['North Carolina', '1789-11-21'],
  RI: ['Rhode Island', '1790-05-29'], VT: ['Vermont', '1791-03-04'], KY: ['Kentucky', '1792-06-01'],
  TN: ['Tennessee', '1796-06-01'], OH: ['Ohio', '1803-03-01'], LA: ['Louisiana', '1812-04-30'],
  IN: ['Indiana', '1816-12-11'], MS: ['Mississippi', '1817-12-10'], IL: ['Illinois', '1818-12-03'],
  AL: ['Alabama', '1819-12-14'], ME: ['Maine', '1820-03-15'], MO: ['Missouri', '1821-08-10'],
  AR: ['Arkansas', '1836-06-15'], MI: ['Michigan', '1837-01-26'], FL: ['Florida', '1845-03-03'],
  TX: ['Texas', '1845-12-29'], IA: ['Iowa', '1846-12-28'], WI: ['Wisconsin', '1848-05-29'],
  CA: ['California', '1850-09-09'], MN: ['Minnesota', '1858-05-11'], OR: ['Oregon', '1859-02-14'],
  KS: ['Kansas', '1861-01-29'], WV: ['West Virginia', '1863-06-20'], NV: ['Nevada', '1864-10-31'],
  NE: ['Nebraska', '1867-03-01'], CO: ['Colorado', '1876-08-01'], ND: ['North Dakota', '1889-11-02'],
  SD: ['South Dakota', '1889-11-02'], MT: ['Montana', '1889-11-08'], WA: ['Washington', '1889-11-11'],
  ID: ['Idaho', '1890-07-03'], WY: ['Wyoming', '1890-07-10'], UT: ['Utah', '1896-01-04'],
  OK: ['Oklahoma', '1907-11-16'], NM: ['New Mexico', '1912-01-06'], AZ: ['Arizona', '1912-02-14'],
  AK: ['Alaska', '1959-01-03'], HI: ['Hawaii', '1959-08-21']
};
// Today's total area (square miles, land and water; U.S. Census Bureau, 2010 census),
// the capital when the state joined (or ratified the Constitution), and today's capital.
// cap: null means there was no fixed capital at the time.
const STATE_INFO = {
  DE: { area: 2489, cap: 'Dover', now: 'Dover' },
  PA: { area: 46054, cap: 'Philadelphia', now: 'Harrisburg' },
  NJ: { area: 8723, cap: null, now: 'Trenton', note: 'Trenton from 1790' },
  GA: { area: 59425, cap: 'Augusta', now: 'Atlanta' },
  CT: { area: 5543, cap: 'Hartford and New Haven', now: 'Hartford', note: 'two capitals until 1875' },
  MA: { area: 10554, cap: 'Boston', now: 'Boston' },
  MD: { area: 12406, cap: 'Annapolis', now: 'Annapolis' },
  SC: { area: 32020, cap: 'Charleston', now: 'Columbia', note: 'the government moved to Columbia in 1790' },
  NH: { area: 9349, cap: null, now: 'Concord', note: 'Concord from 1808' },
  VA: { area: 42775, cap: 'Richmond', now: 'Richmond' },
  NY: { area: 54555, cap: 'New York City', now: 'Albany' },
  NC: { area: 53819, cap: null, now: 'Raleigh', note: 'Raleigh from 1794' },
  RI: { area: 1545, cap: null, now: 'Providence', note: 'five towns shared the role; Providence alone from 1900' },
  VT: { area: 9616, cap: null, now: 'Montpelier', note: 'Montpelier from 1805' },
  KY: { area: 40408, cap: 'Lexington', now: 'Frankfort', note: 'Frankfort was chosen later in 1792' },
  TN: { area: 42144, cap: 'Knoxville', now: 'Nashville' },
  OH: { area: 44826, cap: 'Chillicothe', now: 'Columbus' },
  LA: { area: 52378, cap: 'New Orleans', now: 'Baton Rouge' },
  IN: { area: 36420, cap: 'Corydon', now: 'Indianapolis' },
  MS: { area: 48432, cap: 'Washington (near Natchez)', now: 'Jackson' },
  IL: { area: 57914, cap: 'Kaskaskia', now: 'Springfield' },
  AL: { area: 52420, cap: 'Huntsville', now: 'Montgomery', note: 'a temporary capital' },
  ME: { area: 35380, cap: 'Portland', now: 'Augusta' },
  MO: { area: 69707, cap: 'St. Charles', now: 'Jefferson City', note: 'a temporary capital' },
  AR: { area: 53179, cap: 'Little Rock', now: 'Little Rock' },
  MI: { area: 96714, cap: 'Detroit', now: 'Lansing' },
  FL: { area: 65758, cap: 'Tallahassee', now: 'Tallahassee' },
  TX: { area: 268596, cap: 'Austin', now: 'Austin' },
  IA: { area: 56273, cap: 'Iowa City', now: 'Des Moines' },
  WI: { area: 65496, cap: 'Madison', now: 'Madison' },
  CA: { area: 163695, cap: 'San Jose', now: 'Sacramento' },
  MN: { area: 86936, cap: 'St. Paul', now: 'St. Paul' },
  OR: { area: 98379, cap: 'Salem', now: 'Salem' },
  KS: { area: 82278, cap: 'Topeka', now: 'Topeka' },
  WV: { area: 24230, cap: 'Wheeling', now: 'Charleston' },
  NV: { area: 110572, cap: 'Carson City', now: 'Carson City' },
  NE: { area: 77348, cap: 'Omaha', now: 'Lincoln' },
  CO: { area: 104094, cap: 'Denver', now: 'Denver' },
  ND: { area: 70698, cap: 'Bismarck', now: 'Bismarck' },
  SD: { area: 77116, cap: 'Pierre', now: 'Pierre' },
  MT: { area: 147040, cap: 'Helena', now: 'Helena' },
  WA: { area: 71298, cap: 'Olympia', now: 'Olympia' },
  ID: { area: 83569, cap: 'Boise', now: 'Boise' },
  WY: { area: 97813, cap: 'Cheyenne', now: 'Cheyenne' },
  UT: { area: 84897, cap: 'Salt Lake City', now: 'Salt Lake City' },
  OK: { area: 69899, cap: 'Guthrie', now: 'Oklahoma City' },
  NM: { area: 121590, cap: 'Santa Fe', now: 'Santa Fe' },
  AZ: { area: 113990, cap: 'Phoenix', now: 'Phoenix' },
  AK: { area: 665384, cap: 'Juneau', now: 'Juneau' },
  HI: { area: 10932, cap: 'Honolulu', now: 'Honolulu' }
};
const ORIGINAL13 = ['DE', 'PA', 'NJ', 'GA', 'CT', 'MA', 'MD', 'SC', 'NH', 'VA', 'NY', 'NC', 'RI'];
const CONFEDERACY = ['SC', 'MS', 'FL', 'AL', 'GA', 'LA', 'TX', 'VA', 'AR', 'NC', 'TN'];

// Territorial acquisitions. Areas in square miles (land and water), U.S. Census Bureau / Bureau of Land Management tables.
// Published tables differ by under 1%, so the app shows them rounded.
const ACQ = {
  a1783: { name: 'Treaty of Paris', date: '1783-09-03', sqmi: 888685 , approx: '890,000' },
  a1803: { name: 'Louisiana Purchase', date: '1803-04-30', sqmi: 827192 , approx: '827,000' },
  a1818: { name: 'Red River Basin', date: '1818-10-20', sqmi: 46253, hidden: true , approx: '46,000' },
  a1819: { name: 'Florida (from Spain)', date: '1819-02-22', sqmi: 72003 , approx: '72,000' },
  a1845: { name: 'Texas annexation', date: '1845-12-29', sqmi: 390144 , approx: '390,000' },
  a1846: { name: 'Oregon Treaty', date: '1846-06-15', sqmi: 285580 , approx: '286,000' },
  a1848: { name: 'Mexican Cession', date: '1848-02-02', sqmi: 529017 , approx: '530,000' },
  a1853: { name: 'Gadsden Purchase', date: '1853-12-30', sqmi: 29640 , approx: '30,000' },
  a1867: { name: 'Alaska Purchase', date: '1867-03-30', sqmi: 586412 , approx: '586,000' },
  a1898: { name: 'Hawaii (1898) and Puerto Rico (1898–99)', date: '1898-08-12', sqmi: 6450 + 3435 , approx: '10,000' }
};

// Census counts (or estimates before 1790)
const POP = [
  ['1776', 2.5, 'estimate'], ['1780', 2.8, 'estimate'], ['1790', 3.9], ['1800', 5.3], ['1810', 7.2],
  ['1820', 9.6], ['1830', 12.9], ['1840', 17.1], ['1850', 23.2], ['1860', 31.4], ['1870', 38.6],
  ['1880', 50.2], ['1890', 63.0], ['1900', 76.2], ['1910', 92.2], ['1920', 106.0], ['1930', 123.2],
  ['1940', 132.2], ['1950', 151.3], ['1960', 179.3], ['1970', 203.2], ['1980', 226.5], ['1990', 248.7],
  ['2000', 281.4], ['2010', 308.7], ['2020', 331.4], ['2024', 340.1, 'estimate']
];

const ERAS = [
  { id: 'founding', name: 'A New Nation', from: '1776', to: '1790' },
  { id: 'west', name: 'Growing West', from: '1791', to: '1848' },
  { id: 'crisis', name: 'A House Divided', from: '1849', to: '1865' },
  { id: 'rails', name: 'Rails and Frontier', from: '1866', to: '1912' },
  { id: 'modern', name: 'Modern America', from: '1913', to: '2026' }
];

const STOPS = [
{
  id: '1776', date: '1776-07-04', when: 'July 4, 1776', label: '1776',
  fun: 'John Adams and Thomas Jefferson both helped create the Declaration. Both men died on the same day: July 4, 1826, exactly 50 years later.',
  title: 'Thirteen colonies declare independence',
  states: ORIGINAL13, statesNote: 'The 13 original states',
  place: { name: 'Philadelphia', lon: -75.15, lat: 39.95 },
  what: 'Leaders from 13 British [[colonies|colony]] met in Philadelphia. On July 4, 1776, they approved the Declaration of [[Independence]]. It said the colonies were now free and independent states. The war with Britain had already started in 1775.',
  why: [
    'Britain taxed the colonies, but colonists had no vote in the British Parliament. Their slogan was “No taxation without representation.”',
    'Fighting began at Lexington and Concord, Massachusetts, in April 1775.',
    'Thomas Paine’s booklet <i>Common Sense</i> (January 1776) convinced many colonists that they did not need a king.'
  ],
  person: {
    name: 'Thomas Jefferson', life: '1743–1826', field: 'Politics',
    role: 'Author of the Declaration of Independence; later the 3rd president',
    did: 'Jefferson was 33 years old when he wrote the first draft. Congress changed parts of it, but his most famous words stayed: “all men are created equal,” with rights to “Life, Liberty and the pursuit of Happiness.”'
  },
  progress: 'For the first time, a group of colonies said that a government gets its power from the people it governs: “the consent of the governed.”',
  promise: '“All men are created equal” became a promise. Later Americans, including enslaved people, women, and immigrants, used these words to demand their own rights.',
  cost: 'About one in five people in the colonies was [[enslaved]]. Jefferson himself enslaved more than 600 people during his life.',
  also: 'The main fighting ended in 1781, when a large British army surrendered at Yorktown, Virginia. The war officially ended in 1783.'
},
{
  id: '1783', date: '1783-09-03', when: 'September 3, 1783', label: '1783',
  fun: 'Benjamin West never finished his painting of the peace talks. The British negotiators would not pose for it, so the right side of the canvas is still empty.',
  title: 'Britain recognizes the United States',
  states: [], acq: 'a1783',
  place: null,
  what: 'In Paris, the United States and Great Britain signed a peace [[treaty]]. Britain accepted American independence. The new country now reached west to the Mississippi River, north to the Great Lakes, and south to Spanish Florida.',
  why: [
    'American and French forces defeated the main British army at Yorktown in 1781.',
    'France and Spain helped the Americans with soldiers, ships, and money.',
    'Britain’s government decided that the long war cost too much.'
  ],
  person: {
    name: 'Benjamin Franklin', life: '1706–1790', field: 'Science',
    role: 'Scientist, inventor, and diplomat',
    did: 'Franklin was famous around the world for his experiments with electricity. His fame helped him win France as an ally in 1778. In Paris, he worked with John Adams and John Jay to make the peace treaty.'
  },
  progress: 'The treaty gave the new country about 890,000 square miles. This included the huge region between the Appalachian Mountains and the Mississippi River.',
  promise: 'The states later gave their western land claims to the national government. That land would become new states, equal to the original thirteen.',
  cost: 'No Native nations were part of the treaty. Britain gave away land where the Shawnee, Miami, Cherokee, Creek, and many other peoples lived, without asking them.',
  also: 'In 1785, Congress divided western land into square [[townships|township]], six miles on each side. You can still see this grid from an airplane today.'
},
{
  id: '1787', date: '1787-12-18', when: 'September–December 1787', label: '1787',
  fun: 'Benjamin Franklin, 81, was the oldest man to sign the Constitution. The youngest, Jonathan Dayton of New Jersey, was only 26.',
  title: 'A new Constitution, and the first states say yes',
  states: ['DE', 'PA', 'NJ'], statesNote: 'First to ratify the Constitution',
  place: { name: 'Philadelphia', lon: -75.15, lat: 39.95 },
  what: 'In the summer of 1787, [[delegates|delegate]] met in Philadelphia and wrote a new plan of government: the [[Constitution]]. They signed it on September 17. Then each state had to [[ratify]] it. Delaware voted yes first, on December 7. Pennsylvania and New Jersey followed that same month.',
  why: [
    'The first plan, the Articles of Confederation, made the national government too weak. It could not collect taxes or control trade between the states.',
    'In 1786–87, angry farmers in Massachusetts rose up in Shays’ Rebellion. Many leaders feared the young country could fall apart.',
    'Small states like Delaware liked that every state would have two senators, no matter its size.'
  ],
  person: {
    name: 'James Madison', life: '1751–1836', field: 'Politics',
    role: '“Father of the Constitution”; later the 4th president',
    did: 'Madison studied the history of governments for months before the meeting. His Virginia Plan gave the delegates their starting point. His notes are the best record we have of the debates.'
  },
  progress: 'The Constitution created three branches that check and balance each other: Congress makes laws, the President carries them out, and the courts judge them.',
  promise: 'It begins with the words “We the People.” It also gives a way to change it, through [[amendments|amendment]], so later generations could improve it.',
  cost: 'To keep the Southern states, the Constitution counted each enslaved person as three-fifths of a person when giving out seats in Congress. It also protected the slave trade until 1808.',
  also: 'In July 1787, Congress passed the Northwest Ordinance. It said new territories could become states equal to the old ones, and it banned slavery north of the Ohio River.'
},
{
  id: '1788', date: '1788-07-26', when: 'January–July 1788', label: '1788',
  fun: 'The <i>Federalist</i> essays were signed with a fake name, “Publius.” For years, readers did not know for sure that Hamilton, Madison and Jay had written them.',
  title: 'Nine states make it law',
  states: ['GA', 'CT', 'MA', 'MD', 'SC', 'NH', 'VA', 'NY'], statesNote: 'Ratified the Constitution',
  place: { name: 'Concord, New Hampshire', lon: -71.54, lat: 43.21 },
  what: 'In 1788, eight more states ratified the Constitution. When New Hampshire became the ninth on June 21, the Constitution officially took effect. Virginia, a large and powerful state, joined four days later, and New York a month after that.',
  why: [
    'The Constitution needed nine of the thirteen states to start.',
    'Supporters, called Federalists, wrote newspaper essays to explain the plan. Opponents, the Anti-Federalists, feared a strong central government.',
    'Several states, including Massachusetts, Virginia, and New York, said yes only after supporters promised to add a list of rights.'
  ],
  person: {
    name: 'Alexander Hamilton', life: 'c. 1755–1804', field: 'Economy',
    role: 'Founder of America’s financial system',
    did: 'Hamilton, an immigrant from the Caribbean island of Nevis, wrote 51 of the 85 <i>Federalist</i> essays defending the Constitution. At New York’s meeting, he helped win a close yes vote, 30 to 27. Later, as the first Treasury Secretary, he built the nation’s banking and credit system.'
  },
  progress: 'The states now shared one national government, one army, one currency, and free trade among themselves.',
  promise: 'The debate itself was a promise kept. Citizens argued in newspapers and town meetings, then voted. A big change came through words and votes, not force.',
  cost: 'Most people had no voice in the decision. In most states, only men who owned property or paid taxes could vote, and almost all of them were white.',
  also: 'The first elections for Congress and President took place from December 1788 to January 1789.'
},
{
  id: '1789', date: '1790-05-29', when: '1789–1790', label: '1789',
  fun: 'George Washington’s second inaugural speech, in 1793, was only 135 words long. It is still the shortest in U.S. history.',
  title: 'A president, a Bill of Rights, and the last two states',
  states: ['NC', 'RI'], statesNote: 'Ratified the Constitution',
  place: { name: 'New York City', lon: -74.01, lat: 40.71 },
  what: 'On April 30, 1789, George Washington became the first President, in New York City, the first capital. That fall, Congress proposed the [[Bill of Rights]]. North Carolina ratified the Constitution in November 1789, and Rhode Island in May 1790. All thirteen states were now under the Constitution.',
  why: [
    'North Carolina and Rhode Island waited until they were sure a Bill of Rights was coming.',
    'Rhode Island also faced pressure: Congress was ready to treat it like a foreign country and tax its trade.',
    'Washington’s leadership in the war gave people trust in the new government.'
  ],
  person: {
    name: 'George Washington', life: '1732–1799', field: 'Politics',
    role: 'Commander of the army in the Revolution; 1st president',
    did: 'Washington led the army through eight years of war, then gave up his command and went home instead of seeking power. He was elected President [[unanimously|unanimous]]. He set customs that still guide the country, such as the [[Cabinet]], and he chose to retire after two terms.'
  },
  progress: 'The Bill of Rights, the first ten amendments, was ratified in 1791. It protects freedom of speech, religion, and the press, and the right to a fair trial.',
  promise: 'The Bill of Rights protects people against government power. Over time, courts and new amendments gave these protections to more and more Americans.',
  cost: 'Washington enslaved people at his Mount Vernon farm all his life. In his will, he ordered that the 123 people he owned be freed.',
  also: 'The first [[census]] in 1790 counted 3.9 million people, including almost 700,000 enslaved people.'
},
{
  id: '1791', date: '1791-03-04', when: 'March 4, 1791', label: '1791',
  fun: 'As an independent republic, Vermont ran its own post office and even made its own copper coins.',
  title: 'Vermont, the first new state',
  states: ['VT'],
  place: { name: 'Bennington', lon: -73.2, lat: 42.88 },
  what: 'Vermont became the 14th state, the first one added after the original thirteen. For 14 years before that, Vermont had governed itself as an independent republic.',
  why: [
    'New York and New Hampshire both claimed Vermont’s land. Settlers there refused to accept New York’s rule.',
    'In 1790, Vermont agreed to pay New York $30,000 to end the land dispute.',
    'Northern leaders wanted a new free state. Kentucky, where slavery was legal, was planned to join next.'
  ],
  person: {
    name: 'Thomas Chittenden', life: '1730–1797', field: 'Politics',
    role: 'Leader of the Vermont Republic; first governor of the state',
    did: 'Chittenden led independent Vermont for most of its 14 years. He guided the long talks with New York and Congress that brought Vermont into the Union, and he became its first state governor.'
  },
  progress: 'Vermont proved that the Union could grow. New states could join as full equals to the original thirteen.',
  promise: 'Vermont’s 1777 constitution was the first in America to ban adult slavery. It also let men vote without owning property.',
  cost: 'The Abenaki people had lived in the region for thousands of years. They were not part of these agreements and lost much of their land.',
  also: 'In 1791, Benjamin Banneker, a free Black scientist, helped measure the land for the new capital city, Washington, D.C.'
},
{
  id: '1792', date: '1792-06-01', when: 'June 1, 1792', label: '1792',
  fun: 'The two presidents of the Civil War, Abraham Lincoln and Jefferson Davis, were both born in Kentucky, less than a year apart.',
  title: 'Kentucky: the first state beyond the mountains',
  states: ['KY'],
  place: { name: 'Cumberland Gap', lon: -83.67, lat: 36.6 },
  what: 'Kentucky became the 15th state. It was the first state west of the Appalachian Mountains. Before this, it was part of Virginia.',
  why: [
    'Thousands of settlers crossed the mountains through the Cumberland Gap to find rich farmland.',
    'Kentucky was far from Virginia’s capital. Settlers wanted their own government to protect them and build roads.',
    'Virginia agreed to let Kentucky separate.'
  ],
  person: {
    name: 'Daniel Boone', life: '1734–1820', field: 'Economy',
    role: '[[Pioneer]], hunter, and land surveyor',
    did: 'In 1775, a land company hired Boone to open a route west. He and about 30 men cut the Wilderness Road through the Cumberland Gap. It became one of the main roads west for tens of thousands of families.'
  },
  progress: 'Settlement spread beyond the mountains. The Ohio River became a highway for farm goods going to market.',
  promise: 'Kentucky showed that the West would be part of the nation, with its own voice in Congress.',
  cost: 'Kentucky was hunting land for the Shawnee and Cherokee, who fought hard to keep it. Kentucky also allowed slavery from its first day as a state.',
  also: 'In 1793, Eli Whitney invented the cotton gin, a machine that would change the South (see 1817).'
},
{
  id: '1796', date: '1796-06-01', when: 'June 1, 1796', label: '1796',
  fun: 'Tennessee is called “the Volunteer State” because thousands of its men volunteered to fight in the War of 1812.',
  title: 'Tennessee shows the way to statehood',
  states: ['TN'],
  place: { name: 'Knoxville', lon: -83.92, lat: 35.96 },
  what: 'Tennessee became the 16th state. It was the first state made from a federal [[territory]]: the “Southwest Territory,” land that North Carolina had given to the national government.',
  why: [
    'A count in 1795 found over 77,000 people, more than enough for statehood.',
    'Tennesseans wrote a constitution and asked Congress to admit them, without waiting for Congress to act first. Later territories copied this “Tennessee Plan.”',
    'Settlers wanted protection and a voice in national politics.'
  ],
  person: {
    name: 'John Sevier', life: '1745–1815', field: 'Politics',
    role: 'Frontier leader; first governor of Tennessee',
    did: 'Sevier was a hero of the Battle of Kings Mountain in 1780. In the 1780s he led the short-lived “State of Franklin,” an early attempt to make the region a state. When Tennessee joined the Union, he became its first governor.'
  },
  progress: 'The “Tennessee Plan” gave future territories a clear path: grow, write a constitution, and ask to join.',
  promise: 'Tennessee’s first constitution let free men vote without owning property, including free Black men. The state took that right away from Black men in 1834.',
  cost: 'Settlement pushed onto Cherokee and Chickasaw land, often breaking earlier treaties.',
  also: 'A young lawyer named Andrew Jackson helped write Tennessee’s constitution and became its first member of the U.S. House.'
},
{
  id: '1803', date: '1803-04-30', when: 'March–April 1803', label: '1803',
  fun: 'In 1803, Congress accepted Ohio as a state, but it never passed a formal resolution admitting it. In 1953, for Ohio’s 150th birthday, Congress passed one, dating statehood back to March 1, 1803.',
  title: 'Ohio joins, and the country doubles in size',
  states: ['OH'], acq: 'a1803',
  place: { name: 'New Orleans', lon: -90.07, lat: 29.95 },
  what: 'On March 1, 1803, Ohio became the 17th state, the first from the Northwest Territory. On April 30, the United States agreed to buy the huge Louisiana Territory from France for $15 million. The country almost doubled in size.',
  why: [
    'Western farmers sent their crops down the Mississippi River. Whoever controlled New Orleans controlled their trade.',
    'France needed money for war in Europe, and its army had been defeated by the revolution in Haiti. Napoleon decided to sell all of Louisiana.',
    'Ohio followed the Northwest Ordinance: when enough people lived there, it could become a state.'
  ],
  person: {
    name: 'Robert R. Livingston', life: '1746–1813', field: 'Politics',
    role: 'U.S. minister to France; negotiated the Louisiana Purchase',
    did: 'President Jefferson told Livingston, and later James Monroe, to try to buy New Orleans and West Florida. When France offered all of Louisiana instead, they said yes. Livingston said: “We have lived long, but this is the noblest work of our whole lives.”'
  },
  progress: 'The Purchase added about 827,000 square miles (2.1 million km²). Americans now controlled the whole Mississippi River and the port of New Orleans.',
  promise: 'Jefferson dreamed of a nation of independent farm families. All or part of 15 future states came from this land.',
  cost: 'France sold land it did not really control. Dozens of Native nations, such as the Osage, Lakota, and Pawnee, lived there. The U.S. bought France’s claim, then spent the next century taking the land through treaties and wars.',
  also: 'Jefferson asked Meriwether Lewis and William Clark to explore the new land.'
},
{
  id: '1805', date: '1805-11-15', when: 'November 1805', label: '1805',
  fun: 'The expedition had a dog. Seaman, Meriwether Lewis’s big Newfoundland, traveled with the explorers all the way to the Pacific.',
  title: 'Lewis and Clark reach the Pacific',
  states: [],
  place: { name: 'Mouth of the Columbia River', lon: -123.95, lat: 46.25 },
  what: 'In May 1804, the Corps of Discovery left the St. Louis area to explore the Louisiana Purchase and find a way to the Pacific Ocean. In November 1805, after about 4,000 miles, they reached the Pacific coast. They came back in 1806 with maps, journals, and notes on about 300 plants and animals new to science.',
  why: [
    'Jefferson wanted to know what the United States had bought.',
    'He hoped to find a water route across the continent for trade.',
    'Exploring the Pacific Northwest supported an American claim to the Oregon Country.'
  ],
  person: {
    name: 'Sacagawea', life: 'c. 1788–1812', field: 'Science',
    role: 'Lemhi Shoshone guide and [[interpreter]]',
    did: 'Sacagawea joined the [[expedition]] as a teenager with a baby son. She helped the team get horses from her own Shoshone people and found food plants. Her presence also showed other Native nations that the group came in peace: a war party would not travel with a woman and a baby.'
  },
  progress: 'The expedition’s maps and science opened the West to the American imagination, and to the traders and settlers who followed.',
  promise: 'The journey succeeded because many different people worked together: soldiers, a Shoshone woman, a French-Canadian interpreter, an enslaved Black man named York, and the many Native nations who helped them.',
  cost: 'The journey also began a century of change for Native nations. Traders, settlers, and soldiers soon followed the explorers’ path.',
  also: 'In 1807, Robert Fulton’s steamboat traveled up the Hudson River from New York City to Albany in about 32 hours.'
},
{
  id: '1812', date: '1812-04-30', when: 'April 30, 1812', label: '1812',
  fun: 'Louisiana has no counties. Its local areas are called “parishes,” a name from its French and Spanish Catholic past.',
  title: 'Louisiana: gateway to the Mississippi',
  states: ['LA'],
  place: { name: 'New Orleans', lon: -90.07, lat: 29.95 },
  what: 'Exactly nine years after the Louisiana Purchase, Louisiana became the 18th state, the first made from the Purchase. Its main city, New Orleans, was already one of the busiest ports in North America.',
  why: [
    'New Orleans was the door to the sea for every farm along the Mississippi and Ohio Rivers.',
    'About 77,000 people lived in the territory in 1810, enough for statehood.',
    'Its people mixed French, Spanish, African, Caribbean, and American cultures.'
  ],
  person: {
    name: 'Robert Fulton', life: '1765–1815', field: 'Science',
    role: 'Engineer and steamboat builder',
    did: 'Fulton built the first successful commercial steamboat in 1807. His company’s boat, the <i>New Orleans</i>, reached New Orleans in January 1812, the first steamboat on the Mississippi. Steamboats could travel upriver against the current, so the river became a two-way highway.'
  },
  progress: 'Steam power made river trade faster and cheaper. Within a few decades, hundreds of steamboats carried goods and people on western rivers.',
  promise: 'Louisiana kept its French-style legal system, called civil law. New states could keep their own traditions inside the Union.',
  cost: 'Louisiana’s sugar and cotton farms depended on enslaved workers. In 1811, the German Coast Uprising, the largest slave revolt in U.S. history, was crushed near New Orleans.',
  also: 'In June 1812, the U.S. declared war on Britain. The last big battle of the War of 1812 was Andrew Jackson’s victory at New Orleans in January 1815.'
},
{
  id: '1816', date: '1816-12-11', when: 'December 11, 1816', label: '1816',
  fun: 'People from Indiana are called “Hoosiers,” but no one knows for sure where the word comes from.',
  title: 'Indiana, “land of the Indians”',
  states: ['IN'],
  place: { name: 'Corydon', lon: -86.12, lat: 38.21 },
  what: 'Indiana became the 19th state. Its name means “land of the Indians.” Its first capital was the small town of Corydon. In the summer heat, delegates wrote parts of the state constitution in the shade of a big elm tree.',
  why: [
    'After the War of 1812, settlers moved into the Ohio Valley in large numbers.',
    'Native resistance in the region had been broken at the Battle of Tippecanoe (1811) and in the War of 1812.',
    'Under the Northwest Ordinance, Indiana had to ban slavery, and its constitution did.'
  ],
  person: {
    name: 'William Henry Harrison', life: '1773–1841', field: 'Politics',
    role: 'Governor of Indiana Territory; later the 9th president',
    did: 'As territorial governor from 1801 to 1812, Harrison made treaties that moved millions of acres of Native land to the United States. This opened Indiana to settlers. He led U.S. troops at Tippecanoe in 1811.'
  },
  progress: 'Indiana’s first constitution called for free public schools “equally open to all,” one of the earliest such promises in the country.',
  promise: 'In 1816, young Abraham Lincoln moved to Indiana with his family. Cheap land in a free state gave poor families like his a chance.',
  cost: 'The Shawnee leader Tecumseh tried to unite Native nations to stop the loss of their land. He died in battle in 1813. Many Native communities were later forced to move west.',
  also: 'Construction of the Erie Canal in New York began on July 4, 1817 (see 1837).'
},
{
  id: '1817', date: '1817-12-10', when: 'December 10, 1817', label: '1817',
  fun: 'The name Mississippi comes from the Ojibwe words for “great river.”',
  title: 'Mississippi and the cotton boom',
  states: ['MS'],
  place: { name: 'Natchez', lon: -91.4, lat: 31.56 },
  what: 'Mississippi became the 20th state. Rich soil along the river and world demand for cotton brought thousands of settlers, and thousands of enslaved people, into the region.',
  why: [
    'Factories in Britain and New England needed huge amounts of cotton to make cloth.',
    'The cotton gin made it fast and cheap to clean cotton, so growing it became very profitable.',
    'Natchez, on the Mississippi River, was the center of trade.'
  ],
  person: {
    name: 'Eli Whitney', life: '1765–1825', field: 'Science',
    role: 'Inventor of the cotton gin',
    did: 'In 1793, Whitney built a simple machine that pulled cotton fibers away from the seeds. One worker with a gin could clean about 50 pounds of cotton a day. By hand, a worker could clean only a pound or a few pounds. Cotton farming exploded across the South.'
  },
  progress: 'Cotton became America’s most valuable export. By 1840, it was worth more than all other U.S. exports combined.',
  promise: 'Whitney also promoted “interchangeable parts,” identical pieces that fit any copy of a machine. This idea is at the heart of modern factories.',
  cost: 'The cotton gin did not reduce slavery; it increased it. The number of enslaved people grew from about 700,000 in 1790 to nearly 4 million in 1860. About one million were forced from the Upper South to the Deep South.',
  also: 'In 1817, President James Monroe toured the country. A newspaper called the new mood of national unity the “Era of Good Feelings.”'
},
{
  id: '1818', date: '1818-12-03', when: 'December 3, 1818', label: '1818',
  fun: 'The name Chicago comes from a Native word, <i>shikaakwa</i>, for a wild onion that grew near the lake.',
  title: 'Illinois, and a border that reached Chicago',
  states: ['IL'],
  place: { name: 'Chicago', lon: -87.63, lat: 41.88 },
  what: 'Illinois became the 21st state. The first plan put its northern border at the bottom of Lake Michigan. Congress moved the line about 60 miles north. This gave Illinois a shore on the lake, at the spot that became Chicago.',
  why: [
    'Illinois needed 40,000 people for statehood. The count was very close, and some people may have been counted twice.',
    'Leaders wanted Illinois linked to the Great Lakes, not only to Southern rivers, so it would be tied to the North.',
    'Rich prairie land attracted farmers from the East and the South.'
  ],
  person: {
    name: 'Nathaniel Pope', life: '1784–1850', field: 'Politics',
    role: 'Illinois Territory’s [[delegate]] to Congress',
    did: 'Pope wrote the law that made Illinois a state. He added a change that moved the northern border to 42°30′ north. He argued that a port on Lake Michigan would bind Illinois to the Union. Without him, Chicago would be in Wisconsin.'
  },
  progress: 'Chicago grew from a small fort into one of the world’s largest cities by 1890, a center for railroads, grain, and industry.',
  promise: 'The trading post at Chicago was started in the 1780s by Jean Baptiste Point du Sable, a Black man of African and French descent. He is honored today as Chicago’s founder.',
  cost: 'Illinois banned slavery on paper, but its “Black Laws” limited the rights of free Black people, and some forced labor continued for years.',
  also: 'In October 1818, the U.S. and Britain agreed that the 49th parallel would be the border from Minnesota to the Rocky Mountains.'
},
{
  id: '1819', date: '1819-12-14', when: 'February–December 1819', label: '1819',
  fun: 'St. Augustine, Florida, founded by Spain in 1565, is the oldest European-founded city in the continental United States that has been lived in without a break.',
  title: 'Alabama joins, and Spain gives up Florida',
  states: ['AL'], acq: 'a1819',
  place: { name: 'Huntsville', lon: -86.59, lat: 34.73 },
  what: 'On February 22, 1819, Spain agreed to give Florida to the United States in the Adams–Onís Treaty. The treaty also drew a border between U.S. and Spanish lands all the way to the Pacific. On December 14, Alabama became the 22nd state.',
  why: [
    'Spain could no longer defend Florida. In 1818, General Andrew Jackson had invaded Spanish Florida while fighting the Seminole.',
    'Alabama’s rich dark soil, the “Black Belt,” was perfect for cotton. Settlers rushed in.',
    'After the Creek War of 1813–14, the Creek Nation was forced to give up about 23 million acres in Alabama and Georgia.'
  ],
  person: {
    name: 'John Quincy Adams', life: '1767–1848', field: 'Politics',
    role: 'Secretary of State; later the 6th president',
    did: 'Adams negotiated the treaty with Spain’s minister, Luis de Onís. He won Florida and a border across the continent, the first clear U.S. claim reaching the Pacific Ocean.'
  },
  progress: 'The U.S. now controlled the whole Gulf Coast from Florida to Louisiana.',
  promise: 'Later, as a congressman, Adams fought for eight years against a rule that blocked anti-slavery petitions, and he won. He defended the right of every citizen to be heard.',
  cost: 'Florida was home to the Seminole people, including many Black people who had escaped slavery. The U.S. Army fought three Seminole Wars (1817–1858) to force them out.',
  also: 'In 1819, the country’s first major financial crisis, the Panic of 1819, caused banks to fail and many people to lose their farms.'
},
{
  id: '1820', date: '1821-08-10', when: '1820–1821', label: '1820',
  fun: 'Maine is the only state whose name has just one syllable.',
  title: 'The Missouri Compromise: Maine and Missouri',
  states: ['ME', 'MO'],
  place: { name: 'St. Louis', lon: -90.2, lat: 38.63 },
  what: 'Missouri asked to join as a state that allowed slavery, and Congress argued bitterly. The answer was the Missouri [[Compromise]]. Maine, once part of Massachusetts, joined as a free state on March 15, 1820. Missouri joined as a slave state on August 10, 1821. Slavery was banned in the rest of the Louisiana Purchase north of the line 36°30′.',
  why: [
    'There were 11 free states and 11 slave states. Adding Missouri alone would break the balance in the Senate.',
    'People in Maine had long wanted to separate from Massachusetts.',
    'Leaders feared the fight over slavery could break the Union apart.'
  ],
  person: {
    name: 'Henry Clay', life: '1777–1852', field: 'Politics',
    role: 'Speaker of the House; “the Great Compromiser”',
    did: 'Clay pushed the compromise through Congress. In 1821, he worked out a second deal when Missouri’s constitution tried to keep free Black people out of the state.'
  },
  progress: 'St. Louis became the “Gateway to the West,” where traders and settlers began their journeys west.',
  promise: 'The compromise kept the peace for over 30 years. It showed that Congress could solve hard problems by give and take.',
  cost: 'The peace was fragile. Thomas Jefferson called the crisis “a fire bell in the night,” a warning that slavery could destroy the Union.',
  also: 'In 1821, Mexico won independence from Spain, and the Santa Fe Trail opened trade between Missouri and Mexico’s northern lands.'
},
{
  id: '1836', date: '1836-06-15', when: 'June 15, 1836', label: '1836',
  fun: 'In 1881, Arkansas lawmakers passed a resolution on how to say the state’s name: “AR-kan-saw,” with a silent s.',
  title: 'Arkansas, along the Trail of Tears',
  states: ['AR'],
  place: { name: 'Little Rock', lon: -92.29, lat: 34.75 },
  what: 'Arkansas became the 25th state. In the same years, the U.S. government forced tens of thousands of Native Americans from their homes in the Southeast to “Indian Territory” (today’s Oklahoma). Many of their routes, later called the Trail of Tears, passed through Arkansas.',
  why: [
    'Arkansas joined as a slave state, paired with Michigan, a free state, to keep the balance in Congress.',
    'Cotton farms were spreading along Arkansas’s rivers.',
    'Settlers and the government wanted Native land in the Southeast for farms, and for gold found in Georgia in 1829.'
  ],
  person: {
    name: 'Andrew Jackson', life: '1767–1845', field: 'Politics',
    role: '7th president (1829–1837)',
    did: 'Jackson was a hero to many white settlers, and he signed the law that made Arkansas a state. He also pushed the Indian Removal Act of 1830 through Congress. When the Supreme Court ruled in 1832 that Georgia had no power over the Cherokee Nation, Jackson did not enforce the ruling.'
  },
  progress: 'In Jackson’s time, voting spread to almost all white men, and ordinary people became more active in politics.',
  promise: 'The Cherokee fought removal peacefully, with their own newspaper, petitions, and a lawsuit, and they won in the Supreme Court. Their struggle is part of America’s long fight for justice.',
  cost: 'About 100,000 Native people were forced west in the 1830s and 1840s. On the Cherokee journey of 1838–39 alone, about 4,000 people died.',
  also: 'In March 1836, Texas declared independence from Mexico. After the Alamo fell, Texans won the Battle of San Jacinto in April.'
},
{
  id: '1837', date: '1837-01-26', when: 'January 26, 1837', label: '1837',
  fun: 'Michigan touches four of the five Great Lakes. It has more freshwater shoreline than any other state.',
  title: 'Michigan and the Erie Canal boom',
  states: ['MI'],
  place: { name: 'Detroit', lon: -83.05, lat: 42.33 },
  what: 'Michigan became the 26th state. Its population grew from about 9,000 in 1820 to about 175,000 in 1837, thanks to a new water highway: the Erie Canal.',
  why: [
    'The Erie Canal (1825) connected New York City to the Great Lakes. Settlers could now travel west cheaply by boat.',
    'Michigan and Ohio almost fought over the city of Toledo, the “Toledo War.” Michigan gave up Toledo and got the Upper Peninsula instead.',
    'Congress paired Michigan (free) with Arkansas (slave) to keep the Senate balanced.'
  ],
  person: {
    name: 'DeWitt Clinton', life: '1769–1828', field: 'Economy',
    role: 'Governor of New York; builder of the Erie Canal',
    did: 'Critics called his project “Clinton’s Ditch.” The canal was 363 miles long and took eight years to build. When it opened in 1825, the cost of shipping goods between Buffalo and New York City fell by about 90 percent.'
  },
  progress: 'The canal made New York City the nation’s biggest port and turned the Great Lakes into a busy highway for settlers and goods.',
  promise: 'Thousands of workers, including many Irish [[immigrants|immigrant]], dug the canal by hand. Their work opened the West to millions of families.',
  cost: 'The Ojibwe, Odawa, and Potawatomi peoples gave up most of their Michigan land in treaties, often under heavy pressure.',
  also: 'In 1837, a financial panic hit the country and caused several years of hard times.'
},
{
  id: '1845', date: '1845-12-29', when: 'March–December 1845', label: '1845',
  fun: 'Six flags have flown over Texas: those of Spain, France, Mexico, the Republic of Texas, the Confederacy and the United States.',
  title: 'Florida and Texas join',
  states: ['FL', 'TX'], acq: 'a1845',
  place: { name: 'San Antonio (the Alamo)', lon: -98.49, lat: 29.43 },
  what: 'Florida became the 27th state on March 3, 1845. Texas, an independent country since 1836, became the 28th state on December 29.',
  why: [
    'Texas won independence from Mexico in 1836. Most Texans wanted to join the United States.',
    'Joining took nine years, because Texas would be a large new slave state, and because it could mean war with Mexico.',
    'Many Americans believed in “[[Manifest Destiny]],” the idea that the U.S. was meant to spread across the continent. The phrase was first used in 1845.'
  ],
  person: {
    name: 'Sam Houston', life: '1793–1863', field: 'Politics',
    role: 'President of the Republic of Texas',
    did: 'Houston led the Texan army to victory over Mexico at San Jacinto in 1836 and was twice president of the Republic of Texas. He worked for years to bring Texas into the United States. In 1861, as governor, he refused to support leaving the Union, and he lost his job for it.'
  },
  progress: 'Texas added about 390,000 square miles of ranch and farm land. Its ports, and later its oil, made it an economic giant.',
  promise: 'Tejanos (Texans of Mexican descent), such as Juan Seguín, fought for Texas independence. Texas has been a meeting place of cultures ever since.',
  cost: 'Texas and Florida both allowed slavery. In Florida, the Second Seminole War (1835–1842) was one of the longest and most costly U.S. wars against Native Americans.',
  also: 'In 1844, Samuel Morse sent the first long-distance telegraph message, from Washington to Baltimore: “What hath God wrought.”'
},
{
  id: '1846', date: '1846-12-28', when: 'June–December 1846', label: '1846',
  fun: 'Iowa is the only state whose east and west borders are formed almost completely by rivers: the Mississippi on the east, and the Missouri and Big Sioux on the west.',
  title: 'Oregon is shared, and Iowa joins',
  states: ['IA'], acq: 'a1846',
  place: { name: 'Oregon City (end of the Oregon Trail)', lon: -122.61, lat: 45.36 },
  what: 'On June 15, 1846, the U.S. and Britain signed the Oregon Treaty. They divided the Oregon Country at the 49th parallel, which is still the border with Canada today. On December 28, Iowa became the 29th state, as farm families filled its prairie.',
  why: [
    'Thousands of Americans had traveled the 2,000-mile Oregon Trail to farm in Oregon’s Willamette Valley.',
    'President James K. Polk wanted Oregon, but he did not want a war with Britain while a war with Mexico was starting.',
    'Iowa’s deep, rich soil drew farmers from the East and from Europe.'
  ],
  person: {
    name: 'John Deere', life: '1804–1886', field: 'Economy',
    role: 'Blacksmith and maker of the steel plow',
    did: 'Prairie soil was thick and sticky. It stuck to iron plows, so farmers had to stop and clean them every few steps. In 1837, Deere made a plow of polished steel that cut cleanly through the soil. By 1848 he had moved his business to Moline, Illinois, where it grew into a giant company.'
  },
  progress: 'The steel plow helped turn the tall-grass prairie into some of the richest farmland in the world. Today Iowa grows more corn than any other state.',
  promise: 'The prairie offered land to families with little money, including immigrants from Germany, Norway, Sweden, and the Netherlands.',
  cost: 'The Meskwaki, Sauk, and Ho-Chunk peoples lost their Iowa lands through treaties. In 1857, the Meskwaki bought back land in Iowa, where their community still lives.',
  also: 'In May 1846, the United States went to war with Mexico.'
},
{
  id: '1848', date: '1848-05-29', when: 'February–May 1848', label: '1848',
  fun: 'Wisconsin is called “America’s Dairyland.” Today it makes about a quarter of all the cheese in the United States.',
  title: 'War with Mexico, and the West changes hands',
  states: ['WI'], acq: 'a1848',
  place: { name: 'Madison, Wisconsin', lon: -89.4, lat: 43.07 },
  what: 'The Mexican–American War (1846–1848) ended with the Treaty of Guadalupe Hidalgo on February 2, 1848. Mexico gave up about half of its land, including today’s California, Nevada, and Utah, and most of Arizona. On May 29, Wisconsin became the 30th state.',
  why: [
    'The two countries disagreed about Texas’s southern border: the Nueces River or the Rio Grande.',
    'President Polk wanted California and its Pacific harbors, and Mexico refused to sell.',
    'Wisconsin’s lead mines, forests, and farms attracted settlers, especially immigrants from Germany.'
  ],
  person: {
    name: 'James K. Polk', life: '1795–1849', field: 'Politics',
    role: '11th president (1845–1849)',
    did: 'Polk promised to expand the country, and he did it in one term. He completed the joining of Texas, settled the Oregon border, and won the war with Mexico. In four years, the United States grew by more than a million square miles.'
  },
  progress: 'The U.S. now reached from the Atlantic to the Pacific. Nine days before the treaty was signed, gold had been found in California.',
  promise: 'The treaty promised that Mexicans in the new U.S. lands could become citizens and keep their property. Their descendants sometimes say: “We didn’t cross the border; the border crossed us.”',
  cost: 'Many Americans opposed the war, including a young congressman named Abraham Lincoln. Thousands died on both sides. Later, many Mexican-American families lost their land in U.S. courts despite the treaty.',
  also: 'In July 1848, women and men met at Seneca Falls, New York, and demanded the right to vote for women. Their declaration said “all men and women are created equal.”'
},
{
  id: '1850', date: '1850-09-09', when: 'September 9, 1850', label: '1850',
  fun: 'Levi Strauss, a German immigrant, came to San Francisco during the Gold Rush. In 1873, he and the tailor Jacob Davis patented work pants with metal rivets: the first blue jeans.',
  title: 'Gold! California becomes a state',
  states: ['CA'],
  place: { name: 'Sutter’s Mill', lon: -120.89, lat: 38.8 },
  what: 'Gold was found at Sutter’s Mill in January 1848. By the end of 1849, about 100,000 newcomers had rushed to California from around the world. California skipped the usual territory stage and became the 31st state, a free state.',
  why: [
    'The Gold Rush created a large population almost overnight.',
    'Californians wrote their own constitution in 1849, and it banned slavery.',
    'In the Compromise of 1850, Congress admitted California as a free state, but also passed a harsh law forcing the return of people who escaped slavery.'
  ],
  person: {
    name: 'Mariano Guadalupe Vallejo', life: '1807–1890', field: 'Politics',
    role: 'Californio leader; delegate to the 1849 constitutional [[convention]]',
    did: 'Vallejo had been a Mexican general and one of California’s richest landowners. He helped write the state’s first constitution and served in the first state Senate. That constitution required state laws to be published in both English and Spanish.'
  },
  progress: 'San Francisco grew from about 1,000 people in early 1848 to about 25,000 by the end of 1849. California’s gold paid for new businesses, banks, and railroads.',
  promise: 'People came from Mexico, Chile, China, Europe, and across the United States. California became one of the most diverse places on Earth.',
  cost: 'California’s Native population fell from about 150,000 in 1848 to about 30,000 by 1870, because of disease, hunger, and violence, including killings paid for by the state. Chinese miners faced special taxes and attacks.',
  also: 'In 1852, Harriet Beecher Stowe published <i>Uncle Tom’s Cabin</i>. The novel turned many Northerners against slavery.'
},
{
  id: '1853', date: '1853-12-30', when: 'December 30, 1853', label: '1853',
  fun: 'Tombstone, Arizona, home of the famous 1881 gunfight at the O.K. Corral, stands on land from the Gadsden Purchase.',
  title: 'The last piece of the “lower 48”',
  states: [], acq: 'a1853',
  place: { name: 'Tucson', lon: -110.97, lat: 32.22 },
  what: 'The U.S. agreed to buy about 30,000 square miles of land from Mexico, in today’s southern Arizona and New Mexico, for $10 million. This Gadsden Purchase was the last addition to the land of the “lower 48” states.',
  why: [
    'Railroad builders wanted a flat route to the Pacific through the South, away from the Rocky Mountains.',
    'Parts of the 1848 border were unclear, and both countries claimed the Mesilla Valley.',
    'Mexico’s government needed money.'
  ],
  person: {
    name: 'James Gadsden', life: '1788–1858', field: 'Economy',
    role: 'Railroad president; U.S. minister to Mexico',
    did: 'Gadsden ran a South Carolina railroad and dreamed of a railroad from the South to the Pacific. As U.S. minister to Mexico, he negotiated the purchase. A southern railroad across this land was finished in 1883.'
  },
  progress: 'Railroads later crossed this land, and Tucson grew into a major desert city.',
  promise: 'Mexican-American communities like Tucson’s kept their language, food, music, and traditions, which still shape the Southwest.',
  cost: 'The new border cut the homeland of the Tohono O’odham people in two. Today their nation still works to keep families and traditions connected across it.',
  also: 'In 1854, the Kansas–Nebraska Act let settlers in those territories vote on slavery. It reopened the fight that the Missouri Compromise had settled (see 1861).'
},
{
  id: '1858', date: '1858-05-11', when: 'May 11, 1858', label: '1858',
  fun: 'Minnesota calls itself “the Land of 10,000 Lakes,” but it actually has more than 11,000.',
  title: 'Minnesota: forests, wheat, and flour',
  states: ['MN'],
  place: { name: 'St. Paul', lon: -93.09, lat: 44.95 },
  what: 'Minnesota became the 32nd state. Its forests, lakes, and prairies drew settlers from New England and from Germany, Norway, and Sweden.',
  why: [
    'In 1851, Dakota leaders signed treaties that gave up most of their land in southern Minnesota, opening it to settlers.',
    'The Mississippi River and St. Anthony Falls gave power to sawmills and flour mills.',
    'Minnesota entered as a free state while the nation argued bitterly about slavery.'
  ],
  person: {
    name: 'Cyrus McCormick', life: '1809–1884', field: 'Economy',
    role: 'Inventor and maker of the mechanical reaper',
    did: 'McCormick’s horse-drawn reaper cut wheat many times faster than a worker with a hand tool. In 1847, he built a factory in Chicago and let farmers pay for reapers over time. Machines like his made big wheat farms possible in Minnesota and on the Great Plains.'
  },
  progress: 'By the 1880s, Minneapolis was the flour-milling capital of the world. Companies that started there, such as General Mills and Pillsbury, still feed the world.',
  promise: 'Minnesota’s farms and mills gave work and land to many immigrant families, especially from Scandinavia.',
  cost: 'Broken treaty promises and late payments led to the U.S.–Dakota War of 1862. Afterward, 38 Dakota men were hanged in the largest mass execution in U.S. history, and most Dakota people were forced out of the state.',
  also: 'In 1857, the Supreme Court’s Dred Scott decision said Black Americans could not be citizens. Dred Scott had once lived at Fort Snelling, in what became Minnesota.'
},
{
  id: '1859', date: '1859-02-14', when: 'February 14, 1859', label: '1859',
  fun: 'Oregon’s state flag is the only state flag with a different picture on each side. The back shows a beaver.',
  title: 'Oregon: the end of the trail',
  states: ['OR'],
  place: { name: 'Oregon City', lon: -122.61, lat: 45.36 },
  what: 'On Valentine’s Day, 1859, Oregon became the 33rd state. Tens of thousands of settlers had traveled the Oregon Trail to farm the green Willamette Valley.',
  why: [
    'Oregon’s mild climate and rich soil attracted farm families from the Midwest.',
    'After the 1846 treaty with Britain, Oregon was clearly American land, and Congress created Oregon Territory in 1848.',
    'Settlers wanted their own government and a voice in Washington.'
  ],
  person: {
    name: 'John McLoughlin', life: '1784–1857', field: 'Economy',
    role: 'Fur-trade leader, called the “Father of Oregon”',
    did: 'McLoughlin ran the British Hudson’s Bay Company post at Fort Vancouver. Against his company’s wishes, he gave food, seeds, and loans to tired American settlers at the end of the trail. He later became a U.S. citizen and lived in Oregon City.'
  },
  progress: 'Oregon’s farms, forests, and salmon fisheries became the base of the Pacific Northwest economy.',
  promise: 'McLoughlin’s kindness to newcomers from another country is remembered as part of Oregon’s founding story.',
  cost: 'Oregon’s first constitution banned Black people from moving to the state. Voters repealed the ban in 1926, but other racist words stayed in the constitution until 2002. Native nations were pushed onto reservations after wars in the 1850s.',
  also: 'In October 1859, the abolitionist John Brown attacked the federal armory at Harpers Ferry, Virginia, hoping to start an uprising against slavery.'
},
{
  id: '1861', date: '1861-01-29', when: 'January 29, 1861', label: '1861',
  fun: 'The geographic center of the 48 “lower” states is in Kansas, near the small town of Lebanon.',
  title: 'Kansas joins as the Union breaks apart',
  states: ['KS'], seceded: true,
  place: { name: 'Lawrence, Kansas', lon: -95.24, lat: 38.97 },
  what: 'Kansas became the 34th state, a free state. But the Union was breaking apart. Six Southern states had already declared they were leaving. In April, Confederate forces attacked Fort Sumter, and the Civil War began. Eleven states joined the [[Confederacy]].',
  why: [
    'The Kansas–Nebraska Act (1854) let settlers vote on slavery. Settlers for and against slavery rushed into Kansas, and violence followed: “Bleeding Kansas.”',
    'After years of fighting and fraud, Kansans approved a free-state constitution in 1859.',
    'When Southern senators left Congress, the votes to admit Kansas finally passed.'
  ],
  person: {
    name: 'Clarina Nichols', life: '1810–1885', field: 'Politics',
    role: 'Journalist and women’s rights activist',
    did: 'Nichols attended Kansas’s 1859 constitutional convention, knitting in the hall while she lobbied the all-male delegates. She won rights that were rare for women at the time: to own property, to have equal custody of their children, and to vote in school elections.'
  },
  progress: 'Kansas became a farming powerhouse, later called the “Wheat State.”',
  promise: 'Voting in school elections was an early step. Kansas women won the full right to vote in 1912.',
  cost: 'The Civil War was the deadliest war in American history. About 620,000 to 750,000 soldiers died.',
  also: 'In October 1861, the first telegraph line across the continent was finished. It ended the Pony Express after only 18 months.'
},
{
  id: '1863', date: '1864-10-31', when: '1863–1864', label: '1863',
  fun: 'Nevada sent its whole state constitution to Washington by telegraph. It was the longest telegram ever sent at the time and cost about $4,300.',
  title: 'Two states born in war',
  states: ['WV', 'NV'], seceded: true,
  place: { name: 'Wheeling', lon: -80.72, lat: 40.06 },
  what: 'In the middle of the Civil War, two new states joined the Union. Counties in western Virginia refused to leave the Union with the rest of Virginia, and West Virginia became the 35th state on June 20, 1863. Nevada, rich in silver, became the 36th state on October 31, 1864.',
  why: [
    'Many people in western Virginia were small farmers who owned no slaves and wanted to stay in the Union.',
    'Nevada’s Comstock Lode, found in 1859, was one of the richest silver finds in history. Its silver helped pay for the Union war effort.',
    'President Lincoln and Congress wanted more loyal states to support the war and to help end slavery.'
  ],
  person: {
    name: 'Abraham Lincoln', life: '1809–1865', field: 'Politics',
    role: '16th president (1861–1865)',
    did: 'Lincoln signed the bill creating West Virginia on December 31, 1862. The next day, his [[Emancipation]] [[Proclamation]] declared enslaved people in Confederate areas free. In 1864, he welcomed Nevada, which calls itself “Battle Born.”'
  },
  progress: 'The Union also built for the future during the war. The Homestead Act (1862) offered 160 acres of land to settlers. Other 1862 laws started the transcontinental railroad and paid for new public colleges.',
  promise: 'In the Gettysburg Address (November 19, 1863), Lincoln called for “a new birth of freedom” and a government “of the people, by the people, for the people.”',
  cost: 'West Virginia had to agree to end slavery gradually before it could join. The war’s toll was huge. The Battle of Gettysburg alone left about 50,000 soldiers killed, wounded, captured, or missing.',
  also: 'About 180,000 Black soldiers served in the Union Army, including the famous 54th Massachusetts Regiment.'
},
{
  id: '1865', date: '1865-12-06', when: 'April–December 1865', label: '1865',
  fun: 'Juneteenth, the day freedom was announced in Texas, became a federal holiday in 2021.',
  title: 'The Union is saved, and slavery ends',
  states: [],
  place: { name: 'Appomattox Court House', lon: -78.8, lat: 37.38 },
  what: 'On April 9, 1865, Confederate General Robert E. Lee surrendered at Appomattox, Virginia. Five days later, President Lincoln was shot, and he died the next morning. On June 19, now celebrated as Juneteenth, Union troops announced freedom to enslaved people in Texas. In December, the 13th Amendment ended slavery in the whole country.',
  why: [
    'The Union’s larger population, factories, and railroads wore down the Confederacy.',
    'Nearly 200,000 Black soldiers and sailors fought for the Union and for their own freedom.',
    '[[Abolitionists|abolitionist]] had worked for decades to convince Americans that slavery must end.'
  ],
  person: {
    name: 'Frederick Douglass', life: 'c. 1818–1895', field: 'Politics',
    role: 'Abolitionist, writer, and speaker',
    did: 'Douglass escaped from slavery in 1838 and became one of the most powerful speakers in America. During the war, he met with Lincoln, urged him to let Black men fight, and recruited soldiers, including two of his own sons. After the war, he fought for citizenship and voting rights.'
  },
  progress: 'About four million people were freed. The 14th Amendment (1868) made everyone born in the U.S. a citizen. The 15th Amendment (1870) said no one could be denied the vote because of race.',
  promise: 'During [[Reconstruction]], Black Americans voted, built schools and churches, and won public office. In 1870, Hiram Revels became the first Black U.S. senator.',
  cost: 'After Reconstruction ended in 1877, Southern states passed “[[Jim Crow]]” laws. These laws took away Black Americans’ votes and enforced [[segregation]] for almost a century.',
  also: 'The 11 Confederate states were readmitted to Congress between 1866 and 1870.'
},
{
  id: '1867', date: '1867-03-30', when: 'March 1867', label: '1867',
  fun: 'Alaska is the farthest north and the farthest west state. Because some of its Aleutian Islands cross the 180° line, it is also, on a map, the farthest east.',
  title: 'Nebraska joins, and Alaska is bought from Russia',
  states: ['NE'], acq: 'a1867',
  place: { name: 'Sitka, Alaska', lon: -135.33, lat: 57.05 },
  what: 'On March 1, 1867, Nebraska became the 37th state. Four weeks later, on March 30, the U.S. agreed to buy Alaska from Russia for $7.2 million, about two cents an acre. The U.S. flag was raised at Sitka on October 18, 1867.',
  why: [
    'The Homestead Act brought farmers to Nebraska, and the Union Pacific Railroad was building west from Omaha.',
    'Russia found Alaska hard to defend and feared losing it to Britain. It preferred to sell to the U.S.',
    'Supporters valued Alaska’s fish, furs, and timber, and its position on the Pacific.'
  ],
  person: {
    name: 'William H. Seward', life: '1801–1872', field: 'Politics',
    role: 'Secretary of State (1861–1869)',
    did: 'Seward negotiated the Alaska treaty in an all-night meeting with Russia’s minister. Critics laughed at “Seward’s Folly” and “Seward’s Icebox.” Later, Alaska had gold rushes, starting in the 1880s, and big oil discoveries in 1957 and 1968.'
  },
  progress: 'Alaska added about 586,000 square miles, more than twice the size of Texas.',
  promise: 'In 1971, Alaska Native peoples won a historic land settlement: 44 million acres and nearly $1 billion.',
  cost: 'No one asked the Alaska Native peoples, such as the Iñupiat, Yup’ik, Tlingit, and Unangan (Aleut), who had lived there for thousands of years. In Nebraska, the Pawnee, Lakota, and other nations were pushed off their lands.',
  also: 'In 1866, Congress passed the first Civil Rights Act, which declared all people born in the U.S. to be citizens.'
},
{
  id: '1869', date: '1869-05-10', when: 'May 10, 1869', label: '1869',
  fun: 'The golden spike did not stay in the track. Workers pulled it out right after the ceremony. Today it is in a museum at Stanford University.',
  title: 'The golden spike joins a continent',
  states: [],
  place: { name: 'Promontory Summit, Utah', lon: -112.55, lat: 41.62 },
  what: 'At Promontory Summit, Utah, workers drove a golden spike to join two railroads: the Central Pacific, built east from California, and the Union Pacific, built west from Nebraska. A trip across the country that once took months by wagon now took about a week.',
  why: [
    'The Pacific Railway Act of 1862 gave the railroad companies land and loans for every mile they built.',
    'The nation wanted to tie California and the West to the rest of the Union.',
    'Businesses wanted to move goods and people faster and more cheaply.'
  ],
  person: {
    name: 'Leland Stanford', life: '1824–1893', field: 'Economy',
    role: 'President of the Central Pacific Railroad',
    did: 'Stanford was one of four California businessmen, the “Big Four,” who built the Central Pacific over the Sierra Nevada mountains. He swung the hammer at the golden spike ceremony. Later he founded Stanford University.'
  },
  progress: 'The railroad created a national market. Goods, mail, and people crossed the continent quickly, and new towns grew along the tracks.',
  promise: 'Chinese immigrants did most of the dangerous work of building the Central Pacific. At its peak, about 9 of every 10 workers were Chinese. Today the U.S. Department of Labor honors them in its Hall of Honor.',
  cost: 'Chinese workers were paid less than white workers. In 1882, the Chinese Exclusion Act became the first U.S. law to ban immigration by one nationality. The railroads also helped destroy the bison herds that Plains nations depended on.',
  also: 'In December 1869, Wyoming Territory became the first place in the U.S. to give women the full right to vote (see 1890).'
},
{
  id: '1876', date: '1876-08-01', when: 'August 1, 1876', label: '1876',
  fun: 'At the 1876 Centennial, visitors could climb up inside the arm and torch of the Statue of Liberty. It was shown there to build interest and raise money for the statue project.',
  title: 'Colorado and America’s 100th birthday',
  states: ['CO'],
  place: { name: 'Denver', lon: -104.99, lat: 39.74 },
  what: 'Colorado became the 38th state. It is called the “Centennial State” because it joined in the nation’s 100th year. That summer, millions of visitors came to the Centennial Exhibition in Philadelphia to see America’s newest inventions.',
  why: [
    'Gold and silver finds (“Pikes Peak or Bust,” 1859) brought miners and new towns to the Rocky Mountains.',
    'Railroads reached Denver in 1870, bringing more settlers and businesses.',
    'Colorado’s leaders had tried for years before Congress and the President finally agreed.'
  ],
  person: {
    name: 'Alexander Graham Bell', life: '1847–1922', field: 'Science',
    role: 'Inventor of the telephone',
    did: 'Bell, an immigrant from Scotland and a teacher of deaf students, received a [[patent]] for the telephone in March 1876. At the Centennial Exhibition that June, he showed it to the judges and to Brazil’s emperor, who is said to have cried out, “My God, it speaks!”'
  },
  progress: 'The Centennial showed off the telephone, the typewriter, and a giant steam engine. The U.S. was becoming an industrial leader.',
  promise: 'On July 4, 1876, Susan B. Anthony and other women read a “Declaration of Rights for Women” in Philadelphia. They reminded the nation that its promise was not yet complete.',
  cost: 'In 1864, U.S. soldiers killed about 150 to 230 Cheyenne and Arapaho people, mostly women, children, and elders, at Sand Creek in Colorado. In 1881, most Ute people were forced out of the state.',
  also: 'In June 1876, Lakota and Cheyenne warriors led by Sitting Bull and Crazy Horse defeated Custer’s army at the Little Bighorn in Montana.'
},
{
  id: '1889', date: '1889-11-11', when: 'November 2–11, 1889', label: '1889',
  fun: 'Washington is the only state named after a president.',
  title: 'Four states in ten days',
  states: ['ND', 'SD', 'MT', 'WA'],
  place: { name: 'Bismarck, North Dakota', lon: -100.78, lat: 46.81 },
  what: 'In November 1889, four states joined in ten days: North and South Dakota (November 2), Montana (November 8), and Washington (November 11). President Benjamin Harrison had the two Dakota papers shuffled and covered on purpose, so no one knows which Dakota joined first.',
  why: [
    'Railroads brought hundreds of thousands of settlers to the northern plains.',
    'For years, Congress had blocked these states for party reasons. After the 1888 election, one party controlled Congress and the presidency, and the states were admitted.',
    'Copper in Montana, wheat in the Dakotas, and timber in Washington created booming economies.'
  ],
  person: {
    name: 'James J. Hill', life: '1838–1916', field: 'Economy',
    role: 'Railroad builder, “the Empire Builder”',
    did: 'Born in Canada, Hill built the Great Northern Railway from St. Paul, Minnesota, to Seattle, Washington. It was finished in 1893, largely without federal land grants. To fill his trains, he brought settlers, many from Norway, Sweden, and Germany, and helped them start farms along the line.'
  },
  progress: 'The new states linked the Great Lakes to the Pacific Northwest. Seattle became a gateway to Asia and, later, to Alaska’s gold fields.',
  promise: 'Railroads advertised cheap land in Europe. For millions of immigrants, the northern plains became a new home.',
  cost: 'In 1877, the U.S. took the Black Hills from the Lakota, breaking an 1868 treaty. In 1980, the Supreme Court agreed the land was taken illegally. The Lakota have refused the payment and still ask for the land.',
  also: 'In 1886, the Statue of Liberty was dedicated in New York Harbor, a gift from the people of France.'
},
{
  id: '1890', date: '1890-07-10', when: 'July 3–10, 1890', label: '1890',
  fun: 'Idaho’s state seal is the only one designed by a woman, the artist Emma Edwards Green.',
  title: 'Idaho and Wyoming, and votes for women',
  states: ['ID', 'WY'],
  place: { name: 'Cheyenne, Wyoming', lon: -104.82, lat: 41.14 },
  what: 'Idaho became the 43rd state on July 3, 1890, and Wyoming the 44th on July 10. Wyoming was the first state where women could vote in all elections. Its leaders refused to drop women’s voting rights, even when some members of Congress objected.',
  why: [
    'Mining, cattle ranching, and the railroad brought settlers to the region.',
    'Wyoming Territory gave women the vote in 1869. Historians think leaders wanted publicity and more settlers, especially women, in a place with few of them.',
    'When Congress hesitated, Wyoming lawmakers reportedly replied: “We will remain out of the Union one hundred years rather than come in without the women.”'
  ],
  person: {
    name: 'Esther Hobart Morris', life: '1814–1902', field: 'Politics',
    role: 'First woman to serve as a justice of the peace in the U.S.',
    did: 'In 1870, Morris became a judge in South Pass City, Wyoming, the first woman known to hold such an office in the United States. She became a national symbol of Wyoming’s women’s rights, and her statue stands in the U.S. Capitol.'
  },
  progress: 'In 1924, Wyoming elected Nellie Tayloe Ross, the first woman governor of a U.S. state.',
  promise: 'Wyoming is called “the Equality State.” Its example helped the women’s [[suffrage]] movement across the West.',
  cost: 'In December 1890, U.S. soldiers killed about 250 or more Lakota men, women, and children at Wounded Knee, South Dakota. The same year, the Census said the [[frontier]] was closed.',
  also: 'Ellis Island opened in New York Harbor in 1892. Over the next 62 years, about 12 million immigrants entered the U.S. there.'
},
{
  id: '1896', date: '1896-01-04', when: 'January 4, 1896', label: '1896',
  fun: 'Utah’s Great Salt Lake is much saltier than the ocean, so swimmers float easily.',
  title: 'Utah, after a long wait',
  states: ['UT'],
  place: { name: 'Salt Lake City', lon: -111.89, lat: 40.76 },
  what: 'Utah became the 45th state. Members of the Church of Jesus Christ of Latter-day Saints (often called Mormons) had settled the Salt Lake Valley in 1847. Utah asked to become a state many times over almost 50 years.',
  why: [
    'Congress would not admit Utah while the church allowed [[polygamy]], marriage to more than one wife.',
    'In 1890, the church announced the end of new plural marriages, and Utah’s constitution banned polygamy.',
    'Irrigation turned Utah’s desert valleys into productive farms.'
  ],
  person: {
    name: 'Martha Hughes Cannon', life: '1857–1932', field: 'Science',
    role: 'Physician; first woman elected as a state senator in the U.S.',
    did: 'Cannon trained as a medical doctor and worked for public health. Utah’s 1896 constitution gave women the vote. In the first state election that year, she won a seat in the state Senate, beating several men, including her own husband.'
  },
  progress: 'As a senator, Cannon worked to create Utah’s State Board of Health and wrote laws to protect public health.',
  promise: 'Women in Utah had full voting rights 24 years before the 19th Amendment gave the vote to women across the country.',
  cost: 'Earlier, settlers in Utah had fought the Ute, Shoshone, and other nations. In 1863, U.S. soldiers killed at least 250 Shoshone at the Bear River Massacre.',
  also: 'In 1896, the Supreme Court’s Plessy v. Ferguson decision allowed racial segregation under the rule of “separate but equal.”'
},
{
  id: '1898', date: '1898-08-12', when: 'July–August 1898', label: '1898',
  fun: 'ʻIolani Palace in Honolulu, home of Hawaii’s last king and queen, is the only official royal residence in the United States.',
  title: 'Hawaii, and lands across the sea',
  states: [], acq: 'a1898',
  place: { name: 'Honolulu', lon: -157.86, lat: 21.31 },
  what: 'In 1898, the United States reached beyond North America. Congress voted to [[annex]] Hawaii, President McKinley signed the law on July 7, and the U.S. flag was raised in Honolulu on August 12. After a short war with Spain that year, the U.S. also took Puerto Rico, Guam, and the Philippines.',
  why: [
    'American sugar planters controlled much of Hawaii’s economy. In 1893, a group of them, supported by U.S. Marines, [[overthrew|overthrow]] Hawaii’s queen.',
    'Pearl Harbor in Hawaii was valuable as a navy base in the middle of the Pacific.',
    'The Spanish–American War made the U.S. a world power with territories overseas.'
  ],
  person: {
    name: 'Queen Liliʻuokalani', life: '1838–1917', field: 'Politics',
    role: 'Last [[monarch]] of the Kingdom of Hawaiʻi',
    did: 'Liliʻuokalani tried to return power to Native Hawaiians with a new constitution. After she was overthrown, she protested peacefully, wrote her life story, and went to Washington to oppose annexation. More than 21,000 Native Hawaiians signed petitions against it. She also wrote the famous song “Aloha ʻOe.”'
  },
  progress: 'Hawaii became a key link between the U.S. and Asia, and later a center of Pacific trade and travel.',
  promise: 'In 1993, Congress officially apologized to Native Hawaiians for the U.S. role in overthrowing their kingdom.',
  cost: 'Native Hawaiians lost their government without their consent. From 1896 until 1986, schools could not teach in the Hawaiian language.',
  also: 'Puerto Ricans became U.S. citizens in 1917. Puerto Rico is still a U.S. territory today.'
},
{
  id: '1903', date: '1903-12-17', when: 'December 17, 1903', label: '1903',
  fun: 'The Wright brothers tossed a coin to decide who would fly first. Wilbur won, but his try on December 14 failed. Orville made the first successful flight three days later.',
  title: 'Twelve seconds that changed the world',
  states: [],
  place: { name: 'Kitty Hawk, North Carolina', lon: -75.67, lat: 36.02 },
  what: 'Near Kitty Hawk, North Carolina, Orville and Wilbur Wright made the first powered, controlled airplane flight. The first flight lasted 12 seconds and went 120 feet. Their fourth flight that day lasted 59 seconds.',
  why: [
    'The brothers studied birds and earlier gliders, and they tested wing shapes in a homemade wind tunnel.',
    'They solved the key problem: how to control a plane in the air.',
    'Kitty Hawk had strong, steady winds and soft sand for landings.'
  ],
  person: {
    name: 'Orville and Wilbur Wright', life: '1871–1948 · 1867–1912', field: 'Science',
    role: 'Inventors of the airplane',
    did: 'The Wrights ran a bicycle shop in Dayton, Ohio, and used its money and tools to build their aircraft. They had no college degrees, but they worked like scientists: testing, measuring, and improving step by step.'
  },
  progress: 'Within 25 years, airplanes carried mail and passengers. Flight changed travel, trade, and war.',
  promise: 'Two ordinary people with curiosity and hard work changed the world. In 1969, Neil Armstrong carried a small piece of the Wright Flyer to the Moon.',
  cost: 'Airplanes also became weapons. They were first used widely in World War I (1914–1918).',
  also: 'In 1908, Henry Ford introduced the Model T car. His moving assembly line (1913) made cars cheap enough for working families.'
},
{
  id: '1907', date: '1907-11-16', when: 'November 16, 1907', label: '1907',
  fun: 'Oklahomans are called “Sooners” after settlers who sneaked onto the land “sooner” than the official start of the 1889 land run.',
  title: 'Oklahoma, where many nations met',
  states: ['OK'],
  place: { name: 'Guthrie, Oklahoma', lon: -97.43, lat: 35.88 },
  what: 'Oklahoma became the 46th state. It joined two areas: Oklahoma Territory, opened to settlers in “land runs” starting in 1889, and Indian Territory, where the U.S. had moved many Native nations. The name comes from Choctaw words meaning “red people.”',
  why: [
    'In the first Oklahoma Land Run in 1889, thousands of settlers raced on horses and in wagons to claim free land.',
    'Oil was discovered, and Oklahoma’s oil boom began.',
    'In 1905, leaders of the Five Tribes proposed a separate Native-led state called “Sequoyah,” but Congress did not accept it.'
  ],
  person: {
    name: 'Theodore Roosevelt', life: '1858–1919', field: 'Politics',
    role: '26th president (1901–1909)',
    did: 'Roosevelt signed the 1906 law that joined Oklahoma and Indian Territory into one state, and in 1907 he signed the proclamation that made it a state. As president, he also protected about 230 million acres of public land as national forests, parks, and wildlife refuges.'
  },
  progress: 'Oil made Tulsa the “Oil Capital of the World” in the 1920s.',
  promise: 'Today, 39 tribal nations have their headquarters in Oklahoma. In 2020, the Supreme Court ruled in McGirt v. Oklahoma that the Muscogee (Creek) reservation still exists under federal law.',
  cost: 'Native nations lost most of their land when the government divided it into small private plots. In 1921, a white mob destroyed Greenwood, Tulsa’s successful Black neighborhood, and killed as many as 300 people.',
  also: 'In 1906, Upton Sinclair’s book <i>The Jungle</i> led to the first national food-safety laws.'
},
{
  id: '1912', date: '1912-02-14', when: 'January–February 1912', label: '1912',
  fun: 'Santa Fe, New Mexico, founded around 1610, is the oldest state capital in the United States.',
  title: 'New Mexico and Arizona complete the lower 48',
  states: ['NM', 'AZ'],
  place: { name: 'Santa Fe', lon: -105.94, lat: 35.69 },
  what: 'New Mexico became the 47th state on January 6, 1912, and Arizona the 48th on February 14. The map of the “lower 48” states, between Canada and Mexico, was now complete.',
  why: [
    'Railroads, mining (especially copper), and ranching grew quickly in the region.',
    'Congress had waited for decades, partly because of prejudice against the region’s many Spanish-speaking and Native residents.',
    'President Taft first [[vetoed|veto]] Arizona because its constitution let voters remove judges. Arizona dropped that rule, joined, and then voted it back in.'
  ],
  person: {
    name: 'Octaviano Larrazolo', life: '1859–1930', field: 'Politics',
    role: 'Delegate to New Mexico’s 1910 constitutional convention; later governor and U.S. senator',
    did: 'Born in Mexico, Larrazolo fought to protect Spanish-speaking citizens in New Mexico’s constitution: their right to vote and to go to school could not be taken away because of their language. In 1928, he became the first Mexican-American U.S. senator.'
  },
  progress: 'Large dams such as Roosevelt Dam (1911) brought water to the desert, and cities like Phoenix began to grow.',
  promise: 'New Mexico’s constitution has strong protections for Spanish speakers. The state’s Hispanic and Native cultures remain at the center of its identity.',
  cost: 'Native Americans in both states could not vote in state elections until 1948, when courts finally struck down the bans.',
  also: 'In 1913, the 17th Amendment let voters choose their U.S. senators directly.'
},
{
  id: '1920', date: '1920-08-18', when: 'August 18, 1920', label: '1920',
  fun: 'The 19th Amendment was first introduced in Congress in 1878. Congress finally passed it in 1919, 41 years later.',
  title: 'Women win the vote',
  states: [],
  place: { name: 'Nashville, Tennessee', lon: -86.78, lat: 36.16 },
  what: 'Tennessee became the 36th state to ratify the 19th Amendment, the last one needed. The amendment says the right to vote cannot be denied “on account of sex.” Millions of American women could now vote. The deciding vote came from a 24-year-old lawmaker, Harry Burn, after his mother wrote to him asking him to vote yes.',
  why: [
    'Women had organized for 72 years, since the Seneca Falls meeting in 1848.',
    'Women’s work during World War I strengthened their demand for equal citizenship.',
    'Western states, such as Wyoming, Utah, and Colorado, had already shown that women voting worked.'
  ],
  person: {
    name: 'Susan B. Anthony', life: '1820–1906', field: 'Politics',
    role: 'Leader of the women’s [[suffrage]] movement',
    did: 'Anthony traveled the country for more than 50 years, giving speeches for women’s rights. In 1872, she was arrested for voting in Rochester, New York. The 19th Amendment was nicknamed the “Susan B. Anthony Amendment,” although she died 14 years before it passed.'
  },
  progress: 'Women became voters, candidates, and leaders. In 1916, Jeannette Rankin of Montana became the first woman elected to Congress.',
  promise: 'Anthony’s motto was: “Failure is impossible.”',
  cost: 'Many women of color still could not vote. Black women in the South faced Jim Crow laws. Many Native American and Asian American women could not vote until later laws in 1924, 1952, and 1965.',
  also: 'In 1924, the Indian Citizenship Act made all Native Americans born in the U.S. citizens.'
},
{
  id: '1935', date: '1935-08-14', when: 'August 14, 1935', label: '1935',
  fun: 'The first monthly Social Security check went to Ida May Fuller of Vermont in 1940. She had paid less than $25 in Social Security taxes, lived to 100, and collected nearly $23,000.',
  title: 'The Great Depression and a new safety net',
  states: [],
  place: { name: 'Washington, D.C.', lon: -77.04, lat: 38.9 },
  what: 'The stock market crashed in October 1929, and the Great [[Depression]] began. By 1933, about one in four workers had no job. President Franklin D. Roosevelt’s “New Deal” created jobs and new programs. On August 14, 1935, he signed the Social Security Act.',
  why: [
    'Banks failed, farms were lost, and millions of families lost their savings.',
    'In the Dust Bowl, drought and dust storms drove farm families from the Great Plains.',
    'Many Americans wanted the government to protect people from the worst effects of hard times.'
  ],
  person: {
    name: 'Frances Perkins', life: '1880–1965', field: 'Economy',
    role: 'Secretary of Labor (1933–1945); the first woman in a U.S. Cabinet',
    did: 'In 1911, Perkins saw the Triangle Shirtwaist Factory fire in New York, where 146 workers died. She spent her life making work safer and fairer. As Secretary of Labor, she led the team that designed Social Security and unemployment insurance, and she helped win a national minimum wage in 1938.'
  },
  progress: 'Social Security gave older Americans a monthly income, and unemployment insurance helped workers who lost their jobs. New Deal workers built roads, bridges, dams, and schools that are still used today.',
  promise: 'The New Deal promised that in hard times, Americans would not be left alone. Social Security still supports tens of millions of people.',
  cost: 'At first, Social Security left out farmworkers and household workers. Many Black, Mexican-American, and women workers held those jobs, so they were excluded until changes in the 1950s.',
  also: 'In 1936, Jesse Owens, a Black American athlete, won four gold medals at the Olympic Games in Berlin, Nazi Germany.'
},
{
  id: '1941', date: '1945-09-02', when: '1941–1945', label: '1941',
  fun: 'Navajo “Code Talkers” sent secret messages in their own language during World War II. The enemy never broke their code.',
  title: 'World War II and the “arsenal of democracy”',
  states: [],
  place: { name: 'Pearl Harbor', lon: -157.95, lat: 21.36 },
  what: 'On December 7, 1941, Japan attacked the U.S. Navy base at Pearl Harbor, Hawaii, and the United States entered World War II. More than 16 million Americans served in the armed forces. The war ended in Europe in May 1945, and Japan formally surrendered on September 2, 1945.',
  why: [
    'Germany, Italy, and Japan were conquering countries in Europe, Africa, and Asia.',
    'The attack on Pearl Harbor killed about 2,400 Americans and united the country.',
    'American factories could make more planes, ships, and tanks than any other country.'
  ],
  person: {
    name: 'Franklin D. Roosevelt', life: '1882–1945', field: 'Politics',
    role: '32nd president (1933–1945)',
    did: 'Roosevelt called the U.S. the “arsenal of democracy” and led the country through most of the war. Polio had paralyzed his legs in 1921, and he often used a wheelchair. He was elected four times, more than any other president. He died in April 1945, weeks before victory in Europe.'
  },
  progress: 'Factories hired millions of women (“Rosie the Riveter”) and Black workers. The GI Bill (1944) helped about 8 million veterans go to college or job training and buy homes.',
  promise: 'The U.S. helped create the United Nations (1945) and helped rebuild Europe with the Marshall Plan, hoping to prevent another world war.',
  cost: 'About 405,000 Americans died. At home, about 120,000 Japanese Americans, most of them U.S. citizens, were forced into prison camps. In 1988, Congress apologized and paid the survivors.',
  also: 'The Japanese American 442nd Regimental Combat Team became one of the most decorated units in U.S. history. One of its soldiers was Daniel Inouye (see 1959).'
},
{
  id: '1959', date: '1959-08-21', when: 'January–August 1959', label: '1959',
  fun: 'Measured from its base on the ocean floor, Hawaii’s Mauna Kea is taller than Mount Everest: more than 33,000 feet, mostly under water.',
  title: 'Alaska and Hawaii: the 49th and 50th stars',
  states: ['AK', 'HI'],
  place: { name: 'Honolulu', lon: -157.86, lat: 21.31 },
  what: 'Alaska became the 49th state on January 3, 1959, and Hawaii the 50th on August 21, 1959. For the first time, states joined that did not touch the other states. The 50-star flag flew for the first time on July 4, 1960.',
  why: [
    'World War II showed how important Alaska and Hawaii were for defense in the Pacific.',
    'Alaskans and Hawaiians voted strongly for statehood. They wanted full voting members in Congress and a vote for president.',
    'Some members of Congress had blocked statehood for years, partly for party reasons and partly because of prejudice against Hawaii’s mostly Asian American population.'
  ],
  person: {
    name: 'Daniel K. Inouye', life: '1924–2012', field: 'Politics',
    role: 'War hero; Hawaii’s first congressman and longtime senator',
    did: 'Inouye, the son of Japanese immigrants, lost his right arm fighting in Italy in 1945. He later received the Medal of Honor. He worked for statehood in Hawaii’s territorial [[legislature]]. In 1959, he became Hawaii’s first member of the U.S. House, the first Japanese American in Congress. He then served in the Senate for almost 50 years.'
  },
  progress: 'The country now reached from the Arctic to the tropics. Alaska brought oil, fish, and wilderness. Hawaii brought a gateway to Asia and the Pacific.',
  promise: 'Hawaii was the first state where most people were not of European descent. It sent the first Asian American senator, Hiram Fong, to Washington.',
  cost: 'The 1959 vote in Hawaii offered only two choices: statehood or remaining a territory. Some Native Hawaiians still say that independence should have been an option.',
  also: 'In 1957, the Soviet Union launched Sputnik, the first satellite. The U.S. answered by creating NASA in 1958.'
},
{
  id: '1964', date: '1964-07-02', when: 'July 2, 1964', label: '1964',
  fun: 'The famous “I have a dream” words were not in King’s written speech. Witnesses say the singer Mahalia Jackson called out, “Tell them about the dream, Martin!” Soon after, he did.',
  title: 'Civil rights: making the promise real',
  states: [],
  place: { name: 'Washington, D.C.', lon: -77.04, lat: 38.9 },
  what: 'President Lyndon B. Johnson signed the Civil Rights Act. It banned discrimination based on race, color, religion, sex, or national origin in jobs, schools, and public places such as hotels and restaurants. The next year, the Voting Rights Act of 1965 protected the right to vote.',
  why: [
    'For decades, Black Americans in the South lived under segregation and were blocked from voting.',
    'Peaceful protests, such as the Montgomery Bus Boycott (1955–56), lunch-counter sit-ins (1960), and the March on Washington (1963), moved the nation’s conscience.',
    'TV news showed Americans the violence used against peaceful protesters, as in Birmingham, Alabama, in 1963.'
  ],
  person: {
    name: 'Martin Luther King Jr.', life: '1929–1968', field: 'Politics',
    role: 'Minister and [[civil rights]] leader',
    did: 'King led the Montgomery Bus Boycott and helped lead the 1963 March on Washington, where about 250,000 people heard his “I Have a Dream” speech. He taught [[nonviolent]] protest and won the Nobel Peace Prize in 1964. He was murdered in 1968.'
  },
  progress: 'Segregation signs came down. After 1965, the number of Black voters in the South rose sharply, and more Black Americans were elected to office.',
  promise: 'King dreamed that his children would “not be judged by the color of their skin but by the content of their character.”',
  cost: 'Many civil rights workers were beaten, jailed, or killed, including Medgar Evers in 1963 and three young volunteers in Mississippi in 1964.',
  also: 'In 1965, a new immigration law ended quotas that favored Europeans. More immigrants began to arrive from Asia, Latin America, and Africa.'
},
{
  id: '1969', date: '1969-07-20', when: 'July 20, 1969', label: '1969',
  fun: 'Apollo 11 left a small silicon disk on the Moon. It carries goodwill messages from the leaders of 73 countries.',
  title: 'One giant leap',
  states: [],
  place: { name: 'Kennedy Space Center', lon: -80.6, lat: 28.57 },
  what: 'Apollo 11 astronauts Neil Armstrong and Buzz Aldrin landed on the Moon, while Michael Collins circled above. Armstrong said: “That’s one small step for [a] man, one giant leap for mankind.” Around 600 million people watched on television.',
  why: [
    'In 1961, President John F. Kennedy set the goal of landing a person on the Moon before 1970.',
    'The “Space Race” with the Soviet Union pushed both countries to compete in science and technology.',
    'About 400,000 people worked on the Apollo program.'
  ],
  person: {
    name: 'Katherine Johnson', life: '1918–2020', field: 'Science',
    role: 'NASA mathematician',
    did: 'Johnson calculated flight paths for America’s first spaceflights. In 1962, astronaut John Glenn asked for her to check the computer’s numbers before his flight around the Earth. She worked on the calculations for Apollo 11’s trip to the Moon. In 2015, she received the Presidential Medal of Freedom.'
  },
  progress: 'The space program pushed forward computers, satellites, weather forecasting, and medical technology.',
  promise: 'The astronauts left a sign on the Moon: “We came in peace for all mankind.” Johnson’s story, told in the film <i>Hidden Figures</i> (2016), inspired a new generation of girls and Black students in science.',
  cost: 'Johnson and other Black women mathematicians at NASA’s Langley center first worked in a segregated office, and they faced both racism and sexism.',
  also: 'In October 1969, the first message was sent over ARPANET, the network that grew into the Internet (see 1983).'
},
{
  id: '1983', date: '1983-01-01', when: 'January 1, 1983', label: '1983',
  fun: 'The first message ever sent over ARPANET, in 1969, was supposed to be “LOGIN.” The system crashed after just two letters, so the first message was “LO.”',
  title: 'The Internet connects the world',
  states: [],
  place: { name: 'Silicon Valley, California', lon: -122.03, lat: 37.37 },
  what: 'ARPANET, a computer network funded by the U.S. government, switched to a new shared language for computers called TCP/IP. Many people call this the birthday of the Internet. In the 1990s, the World Wide Web and web browsers brought the Internet into homes, schools, and businesses.',
  why: [
    'The U.S. Department of Defense paid for research on networks that could share information and keep working if parts were damaged.',
    'Universities wanted to share computers and research.',
    'Personal computers, from companies like Apple (1976) and IBM (1981), put computing power on people’s desks.'
  ],
  person: {
    name: 'Vint Cerf', life: 'born 1943', field: 'Science',
    role: 'Computer scientist; co-inventor of TCP/IP',
    did: 'With Robert Kahn, Cerf designed TCP/IP in 1973–74: the rules that let different computer networks talk to each other. They made the design open and free, so anyone could build on it. Both men received the Presidential Medal of Freedom in 2005.'
  },
  progress: 'Email, online shopping, video calls, and smartphones all depend on the Internet. Today, more than five billion people use it.',
  promise: 'An open Internet means anyone can share ideas, learn, or start a business, including people learning English, like many readers of this page.',
  cost: 'The Internet also brought new problems: false information, privacy risks, and a “digital divide” between people with and without access.',
  also: 'In 1981, Sandra Day O’Connor became the first woman on the Supreme Court.'
},
{
  id: '2020', date: '2020-12-14', when: '2020', label: '2020',
  fun: 'Sandra Lindsay, a nurse who had immigrated from Jamaica, was the first person in the United States to get a COVID-19 vaccine outside a clinical trial, on December 14, 2020.',
  title: 'A pandemic, and a race for vaccines',
  states: [],
  place: { name: 'Philadelphia (University of Pennsylvania)', lon: -75.19, lat: 39.95 },
  what: 'In 2020, the COVID-19 [[pandemic]] spread around the world. Schools and businesses closed, and by 2022 more than one million Americans had died. Scientists made safe, effective [[vaccines|vaccine]] in less than a year using a new technology called mRNA. The first U.S. shot outside a clinical trial was given on December 14, 2020, to a nurse in New York City.',
  why: [
    'A new virus spread quickly, and no one had protection against it.',
    'Decades of earlier research on mRNA made fast vaccine development possible.',
    'Governments and companies spent billions of dollars to speed up testing and production.'
  ],
  person: {
    name: 'Katalin Karikó', life: 'born 1955', field: 'Science',
    role: 'Biochemist; 2023 Nobel Prize in Medicine',
    did: 'Karikó moved to the U.S. from Hungary in 1985. For years her mRNA research got little money, and she was demoted. Working with Drew Weissman at the University of Pennsylvania, she found in 2005 how to make mRNA safe to use in the body. That discovery made the COVID-19 mRNA vaccines possible.'
  },
  progress: 'Scientists are now testing mRNA against flu, cancer, and other diseases.',
  promise: 'Karikó’s story is an immigrant’s story. She arrived with her family’s savings hidden inside her daughter’s teddy bear, and her work helped save millions of lives.',
  cost: 'The pandemic hit older people, low-income workers, and many Black, Hispanic, and Native American communities especially hard.',
  also: 'In 2021, NASA flew the Ingenuity helicopter on Mars, the first powered flight on another planet. It carried a small piece of cloth from the 1903 Wright Flyer.'
},
{
  id: '2026', date: '2026-07-04', when: 'July 4, 2026', label: '2026',
  fun: 'A 250th anniversary has a special name: a “semiquincentennial.”',
  title: 'America at 250',
  states: [],
  place: { name: 'Philadelphia (Independence Hall)', lon: -75.15, lat: 39.95 },
  what: 'The United States celebrates 250 years since the Declaration of Independence. It began as 13 states along the Atlantic coast. Today it has 50 states, about 340 million people, and land that reaches from the Arctic to the tropics.',
  whyTitle: 'What made it possible',
  why: [
    'New land, from purchases, treaties, and wars, that grew the country to about 3.8 million square miles.',
    'New people: Native nations, enslaved Africans and their descendants, and immigrants from every continent.',
    'A Constitution that can change. It has been amended 27 times.'
  ],
  person: {
    name: 'We the People', life: '1776–today', field: 'Everyone',
    role: 'About 340 million Americans',
    did: 'The Constitution begins with “We the People.” Every milestone in this story was shaped by ordinary people as well as famous ones: farmers, workers, inventors, soldiers, teachers, and immigrants. People living today will write the next chapter. Perhaps that includes you.'
  },
  progress: 'In 250 years, Americans built railroads, flew to the Moon, connected the world through the Internet, and created vaccines in record time.',
  promise: 'Each generation has widened the promise of 1776, that all people are created equal. It is still a work in progress.',
  costTitle: 'Still unfinished',
  cost: 'Washington, D.C., and U.S. territories such as Puerto Rico and Guam still have no voting members in Congress. Americans continue to debate who belongs and who has a voice, as they always have.',
  also: ''
}
];

const GLOSSARY = {
  colony: 'A place ruled by a faraway country.',
  independence: 'Freedom from control by another country.',
  treaty: 'A written agreement between countries or nations.',
  township: 'A square piece of land, six miles on each side, used to divide and sell western land.',
  delegate: 'A person chosen to speak and vote for others at a meeting.',
  constitution: 'The basic set of rules for a government.',
  ratify: 'To officially approve something, such as a constitution or treaty, by voting.',
  amendment: 'An official change or addition to the Constitution.',
  'bill of rights': 'The first ten amendments to the Constitution, which protect basic freedoms.',
  unanimous: 'With everyone agreeing.',
  cabinet: 'The group of top advisers who lead the government’s departments.',
  census: 'An official count of all the people in a country. The U.S. holds one every 10 years.',
  enslaved: 'Forced to work without pay, and owned by another person.',
  pioneer: 'One of the first people to settle in a new area.',
  territory: 'Land that belongs to the U.S. but is not (yet) a state.',
  interpreter: 'A person who translates speech from one language to another.',
  expedition: 'A long journey made to explore a place.',
  compromise: 'An agreement in which each side gives up part of what it wants.',
  immigrant: 'A person who moves to a new country to live there.',
  'manifest destiny': 'The 1800s belief that the U.S. was meant to spread across North America.',
  convention: 'A large formal meeting held to decide something important.',
  confederacy: 'The 11 Southern states that left the U.S. in 1860–61 and fought the Civil War.',
  emancipation: 'Freeing people from slavery.',
  proclamation: 'An official public announcement.',
  abolitionist: 'A person who worked to end slavery.',
  reconstruction: 'The period after the Civil War (1865–1877), when the South was rebuilt and freed people gained new rights.',
  'jim crow': 'Laws in the South, from about 1877 to 1965, that kept Black and white people apart and blocked Black people from voting.',
  segregation: 'Keeping people apart because of their race, by law or by custom.',
  patent: 'A government document that protects an inventor’s idea for a number of years.',
  suffrage: 'The right to vote.',
  frontier: 'The edge of settled land, where new settlement begins.',
  polygamy: 'Being married to more than one person at the same time.',
  annex: 'To make another territory part of your country.',
  overthrow: 'To remove a leader or government from power by force.',
  monarch: 'A king or queen.',
  veto: 'When a president or governor officially rejects a bill so it does not become law. Lawmakers can override a veto with a large vote.',
  depression: 'A long period when many businesses fail and many people lose their jobs.',
  legislature: 'The group of elected people who make the laws.',
  'civil rights': 'The rights every citizen should have, such as voting and equal treatment.',
  nonviolent: 'Protesting without using force or hurting anyone.',
  pandemic: 'A disease that spreads across many countries at the same time.',
  vaccine: 'A medicine that trains the body to fight a disease.'
};

module.exports = { STATES, STATE_INFO, ORIGINAL13, CONFEDERACY, ACQ, POP, ERAS, STOPS, GLOSSARY };
