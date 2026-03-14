import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    // PostgreSQL: create database if not exists
    if (process.env.DB_TYPE === 'postgres') {
      try {
        await this.dataSource.query('SELECT 1');
      } catch (error: any) {
        if (error.code === '3D000') { // database does not exist
          // Need to connect to default postgres database first
          const { DataSource } = require('typeorm');
          const defaultDataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: 'postgres', // connect to default db
          });
          
          await defaultDataSource.initialize();
          await defaultDataSource.query(`CREATE DATABASE ${process.env.DB_NAME || 'demo'}`);
          await defaultDataSource.destroy();
        }
      }
    }
  }
}
