CREATE DATABASE finalproject; 

CREATE TABLE users(
    users_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    region VARCHAR (255) NOT NULL,
    phonenumber VARCHAR(255) NOT NULL,
    profile_pic BYTEA,
    bio VARCHAR(255),
    hobbie1 VARCHAR(255),
    hobbie2 VARCHAR(255),
    hobbie3 VARCHAR(255),
    fact1 VARCHAR(255),
    fact2 VARCHAR(255),
    lie VARCHAR(255),
    refreshtoken VARCHAR(1000),
    accesstoken VARCHAR(1000),
    friendslist VARCHAR [],
    active BOOLEAN NOT NULL DEFAULT false,
    time_created TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);

CREATE TABLE conversations(
    conversation_id SERIAL PRIMARY KEY,
    members VARCHAR [] NOT NULL,
    time_created TIMESTAMP NOT NULL,
    last_message VARCHAR (255),
    last_message_date TIMESTAMP
);

CREATE TABLE messages(
    message_id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL,
    senderId VARCHAR(255) NOT NULL,
    recieverId VARCHAR(255) NOT NULL,
    time_sent TIMESTAMP,
    seen BOOLEAN DEFAULT false,
    message VARCHAR(255) NOT NULL
);


ALTER TABLE conversations
ADD FOREIGN KEY (members) REFERENCES users(users_id);