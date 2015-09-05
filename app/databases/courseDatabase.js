import WebSQL from '../utils/WebSQL';

var migartions = {
  '1.0': 'CREATE TABLE info(ID INTEGER PRIMARY KEY, key TEXT, value TEXT);',
  '1.1': 'CREATE INDEX info_key_index ON info (key);',
  '2.1': 'CREATE TABLE courses(ID INTEGER PRIMARY KEY, code CHARACTER(255), general_code CHARACTER(255), full_semester TINYINT, year SMALLINT, term TINYINT, name CHARACTER(255), name_en CHARACTER(255), lecturer CHARACTER(255), credits TINYINT, required TINYINT, url CHARACTER(255), website CHARACTER(255), prerequisites CHARACTER(255), day_1 TINYINT, day_2 TINYINT, day_3 TINYINT, day_4 TINYINT, day_5 TINYINT, day_6 TINYINT, day_7 TINYINT, day_8 TINYINT, day_9 TINYINT, period_1 TINYINT, period_2 TINYINT, period_3 TINYINT, period_4 TINYINT, period_5 TINYINT, period_6 TINYINT, period_7 TINYINT, period_8 TINYINT, period_9 TINYINT, location_1 CHARACTER(255), location_2 CHARACTER(255), location_3 CHARACTER(255), location_4 CHARACTER(255), location_5 CHARACTER(255), location_6 CHARACTER(255), location_7 CHARACTER(255), location_8 CHARACTER(255), location_9 CHARACTER(255), students_enrolled SMALLINT);',
  '2.2': 'ALTER TABLE courses ADD COLUMN search_keywords TEXT;'
}

var courseDatabase = new WebSQL('course', 'course', 3*1024*1024, migartions);

window.courseDatabase = courseDatabase;

export default courseDatabase;
