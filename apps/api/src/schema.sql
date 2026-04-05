CREATE TABLE IF NOT EXISTS hospitals (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city ENUM('Guangzhou','Shenzhen') NOT NULL,
  address VARCHAR(512) NULL,
  summary TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  passport VARCHAR(128) NOT NULL,
  im_type VARCHAR(32) NOT NULL,
  im_handle VARCHAR(128) NOT NULL,
  medical_record_note TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resources (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  type ENUM('Hotel','Restaurant','TransportAirport','TransportCityHospital','HospitalPartner') NOT NULL,
  name VARCHAR(255) NOT NULL,
  city ENUM('Guangzhou','Shenzhen') NOT NULL,
  address VARCHAR(512) NULL,
  contact_name VARCHAR(128) NULL,
  contact_phone VARCHAR(64) NULL,
  contact_im VARCHAR(128) NULL,
  status ENUM('Negotiating','Active','Paused') NOT NULL DEFAULT 'Negotiating',
  note TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_resources_type_name (type, name)
);

