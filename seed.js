const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: 'postgresql://postgres:APZQWbAntHRAZIJHKAbjjobjAnJtFAle@thomas.proxy.rlwy.net:33527/railway',
  connectionTimeoutMillis: 30000,
});

const BASE = {
  'Egypt':        {'Software Engineer':18000,'Doctor':20000,'Nurse':7000,'Pharmacist':9000,'Civil Engineer':13000,'Accountant':10000,'Teacher':7000,'Marketing Manager':13000,'Sales Representative':8000,'Project Manager':15000,'HR Manager':10000,'Financial Analyst':11500,'Lawyer':14500,'Data Analyst':13500,'Electrical Engineer':13000,'Mechanical Engineer':13000,'Architect':13000,'Pilot':23000,'Chef':6500,'Operations Manager':13500},
  'Lebanon':      {'Software Engineer':800,'Doctor':1200,'Nurse':400,'Pharmacist':550,'Civil Engineer':700,'Accountant':520,'Teacher':380,'Marketing Manager':650,'Sales Representative':420,'Project Manager':800,'HR Manager':530,'Financial Analyst':600,'Lawyer':770,'Data Analyst':710,'Electrical Engineer':680,'Mechanical Engineer':680,'Architect':685,'Pilot':1280,'Chef':365,'Operations Manager':710},
  'Iraq':         {'Software Engineer':900,'Doctor':1400,'Nurse':480,'Pharmacist':600,'Civil Engineer':750,'Accountant':550,'Teacher':420,'Marketing Manager':700,'Sales Representative':450,'Project Manager':850,'HR Manager':535,'Financial Analyst':615,'Lawyer':775,'Data Analyst':715,'Electrical Engineer':740,'Mechanical Engineer':740,'Architect':745,'Pilot':1360,'Chef':380,'Operations Manager':720},
  'Morocco':      {'Software Engineer':1100,'Doctor':1500,'Nurse':500,'Pharmacist':700,'Civil Engineer':850,'Accountant':650,'Teacher':470,'Marketing Manager':800,'Sales Representative':500,'Project Manager':950,'HR Manager':630,'Financial Analyst':725,'Lawyer':920,'Data Analyst':840,'Electrical Engineer':838,'Mechanical Engineer':838,'Architect':843,'Pilot':1600,'Chef':445,'Operations Manager':843},
  'Tunisia':      {'Software Engineer':900,'Doctor':1300,'Nurse':420,'Pharmacist':600,'Civil Engineer':720,'Accountant':560,'Teacher':400,'Marketing Manager':680,'Sales Representative':430,'Project Manager':820,'HR Manager':545,'Financial Analyst':628,'Lawyer':798,'Data Analyst':732,'Electrical Engineer':712,'Mechanical Engineer':712,'Architect':716,'Pilot':1378,'Chef':384,'Operations Manager':728},
  'Algeria':      {'Software Engineer':850,'Doctor':1200,'Nurse':390,'Pharmacist':560,'Civil Engineer':670,'Accountant':520,'Teacher':370,'Marketing Manager':630,'Sales Representative':400,'Project Manager':760,'HR Manager':507,'Financial Analyst':585,'Lawyer':742,'Data Analyst':681,'Electrical Engineer':662,'Mechanical Engineer':662,'Architect':666,'Pilot':1282,'Chef':357,'Operations Manager':678},
  'Libya':        {'Software Engineer':750,'Doctor':1100,'Nurse':360,'Pharmacist':510,'Civil Engineer':610,'Accountant':480,'Teacher':340,'Marketing Manager':580,'Sales Representative':370,'Project Manager':700,'HR Manager':472,'Financial Analyst':544,'Lawyer':690,'Data Analyst':635,'Electrical Engineer':600,'Mechanical Engineer':600,'Architect':604,'Pilot':1191,'Chef':332,'Operations Manager':631},
  'Sudan':        {'Software Engineer':400,'Doctor':650,'Nurse':210,'Pharmacist':300,'Civil Engineer':360,'Accountant':290,'Teacher':210,'Marketing Manager':340,'Sales Representative':230,'Project Manager':420,'HR Manager':280,'Financial Analyst':323,'Lawyer':410,'Data Analyst':378,'Electrical Engineer':354,'Mechanical Engineer':354,'Architect':357,'Pilot':673,'Chef':188,'Operations Manager':377},
  'Syria':        {'Software Engineer':300,'Doctor':520,'Nurse':170,'Pharmacist':250,'Civil Engineer':290,'Accountant':240,'Teacher':170,'Marketing Manager':280,'Sales Representative':190,'Project Manager':340,'HR Manager':227,'Financial Analyst':262,'Lawyer':332,'Data Analyst':306,'Electrical Engineer':283,'Mechanical Engineer':283,'Architect':285,'Pilot':546,'Chef':153,'Operations Manager':305},
  'Yemen':        {'Software Engineer':240,'Doctor':420,'Nurse':140,'Pharmacist':200,'Civil Engineer':230,'Accountant':190,'Teacher':140,'Marketing Manager':230,'Sales Representative':155,'Project Manager':280,'HR Manager':188,'Financial Analyst':217,'Lawyer':276,'Data Analyst':254,'Electrical Engineer':228,'Mechanical Engineer':228,'Architect':229,'Pilot':449,'Chef':126,'Operations Manager':252},
  'Palestine':    {'Software Engineer':900,'Doctor':1300,'Nurse':460,'Pharmacist':600,'Civil Engineer':730,'Accountant':570,'Teacher':420,'Marketing Manager':700,'Sales Representative':460,'Project Manager':850,'HR Manager':563,'Financial Analyst':650,'Lawyer':825,'Data Analyst':760,'Electrical Engineer':717,'Mechanical Engineer':717,'Architect':723,'Pilot':1411,'Chef':374,'Operations Manager':757},
  'Somalia':      {'Software Engineer':280,'Doctor':480,'Nurse':160,'Pharmacist':230,'Civil Engineer':270,'Accountant':220,'Teacher':160,'Marketing Manager':260,'Sales Representative':175,'Project Manager':320,'HR Manager':214,'Financial Analyst':247,'Lawyer':313,'Data Analyst':289,'Electrical Engineer':264,'Mechanical Engineer':264,'Architect':265,'Pilot':507,'Chef':143,'Operations Manager':288},
  'Comoros':      {'Software Engineer':250,'Doctor':430,'Nurse':145,'Pharmacist':210,'Civil Engineer':245,'Accountant':195,'Teacher':140,'Marketing Manager':235,'Sales Representative':160,'Project Manager':290,'HR Manager':194,'Financial Analyst':224,'Lawyer':285,'Data Analyst':263,'Electrical Engineer':238,'Mechanical Engineer':238,'Architect':239,'Pilot':461,'Chef':130,'Operations Manager':262},
  'Djibouti':     {'Software Engineer':580,'Doctor':970,'Nurse':310,'Pharmacist':460,'Civil Engineer':545,'Accountant':430,'Teacher':310,'Marketing Manager':515,'Sales Representative':345,'Project Manager':650,'HR Manager':432,'Financial Analyst':499,'Lawyer':634,'Data Analyst':584,'Electrical Engineer':536,'Mechanical Engineer':536,'Architect':540,'Pilot':1025,'Chef':280,'Operations Manager':582},
  'Mauritania':   {'Software Engineer':350,'Doctor':590,'Nurse':195,'Pharmacist':285,'Civil Engineer':335,'Accountant':270,'Teacher':190,'Marketing Manager':320,'Sales Representative':215,'Project Manager':400,'HR Manager':267,'Financial Analyst':308,'Lawyer':391,'Data Analyst':361,'Electrical Engineer':328,'Mechanical Engineer':328,'Architect':330,'Pilot':626,'Chef':171,'Operations Manager':360},
};

const seniorities = ['Junior','Mid-Level','Senior','Senior+','Manager','Director','C-Suite'];
const senMult = {'Junior':0.5,'Mid-Level':1.0,'Senior':1.6,'Senior+':2.1,'Manager':2.6,'Director':3.5,'C-Suite':4.8};
const experiences = {'Junior':'0-1','Mid-Level':'1-3','Senior':'3-5','Senior+':'8-12','Manager':'8-12','Director':'12+','C-Suite':'12+'};
const educations = ["Bachelor's","Master's","Bachelor's","PhD","Professional Cert"];
const nats = ['Local National','Arab (Other)','Western Expat','Asian Expat'];
const currencies = {'Egypt':'EGP','Lebanon':'USD','Iraq':'USD','Morocco':'USD','Tunisia':'USD','Algeria':'USD','Libya':'USD','Sudan':'USD','Syria':'USD','Yemen':'USD','Palestine':'USD','Somalia':'USD','Comoros':'USD','Djibouti':'USD','Mauritania':'USD'};
const jobAr = {'Software Engineer':'مهندس برمجيات','Doctor':'طبيب','Nurse':'ممرض','Pharmacist':'صيدلاني','Civil Engineer':'مهندس مدني','Accountant':'محاسب','Teacher':'معلم','Marketing Manager':'مدير تسويق','Sales Representative':'مندوب مبيعات','Project Manager':'مدير مشروع','HR Manager':'مدير موارد بشرية','Financial Analyst':'محلل مالي','Lawyer':'محامي','Data Analyst':'محلل بيانات','Electrical Engineer':'مهندس كهربائي','Mechanical Engineer':'مهندس ميكانيكي','Architect':'مهندس معماري','Pilot':'طيار','Chef':'طباخ','Operations Manager':'مدير عمليات'};

function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function vary(v) { return Math.round(v*(0.88+Math.random()*0.24)/50)*50; }

async function insertWithRetry(sql, params, retries=5) {
  for (let i=0; i<retries; i++) {
    try {
      await pool.query(sql, params);
      return;
    } catch(e) {
      if (i===retries-1) throw e;
      console.log(`Retry ${i+1}...`);
      await new Promise(r=>setTimeout(r,3000));
    }
  }
}

async function run() {
  let count = 0;
  for (const [country, jobs] of Object.entries(BASE)) {
    const cur = currencies[country];
    const rows = [];
    for (const [job, midSalary] of Object.entries(jobs)) {
      for (const sen of seniorities) {
        const entries = Math.floor(Math.random()*2)+2;
        for (let i=0; i<entries; i++) {
          const salary = vary(midSalary * senMult[sen]);
          const bonus = Math.random()>0.5 ? Math.round(salary*0.1/50)*50 : null;
          rows.push([job,jobAr[job],job,sen,Math.random()>0.3?'Private':'Government',country,salary,cur,bonus,experiences[sen],pick(educations),pick(nats),Math.random()>0.6,Math.random()>0.7]);
          count++;
        }
      }
    }
    const placeholders = rows.map((_,i) => {
      const b = i*14;
      return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7},$${b+8},$${b+9},$${b+10},$${b+11},$${b+12},$${b+13},$${b+14})`;
    }).join(',');
    await insertWithRetry(
      `INSERT INTO salaries (job_title,job_title_ar,job_title_en,seniority,company_type,country,monthly_salary,currency,bonus,experience,education,nationality_type,housing_provided,car_provided) VALUES ${placeholders}`,
      rows.flat()
    );
    console.log(`✓ ${country} done`);
  }
  console.log(`✅ ALL DONE! ${count} records`);
  pool.end();
}

run().catch(e=>{console.error(e);pool.end();});