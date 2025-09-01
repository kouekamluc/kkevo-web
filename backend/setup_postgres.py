#!/usr/bin/env python3
"""
PostgreSQL Database Setup Script for KKEVO
This script helps set up the PostgreSQL database with the correct credentials.
"""

import psycopg
import os
from pathlib import Path

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',
    'password': 'kouekam',
    'database': 'kkevo'
}

def test_connection():
    """Test connection to PostgreSQL server"""
    try:
        # Try to connect to default postgres database first
        conn = psycopg.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            dbname='postgres'
        )
        print("✅ Successfully connected to PostgreSQL server")
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Failed to connect to PostgreSQL server: {e}")
        return False

def create_database():
    """Create the kkevo database if it doesn't exist"""
    try:
        # Connect to default postgres database
        conn = psycopg.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            dbname='postgres'
        )
        
        # Check if database exists
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_CONFIG['database'],))
            exists = cur.fetchone()
            
            if not exists:
                # Create database
                cur.execute(f"CREATE DATABASE {DB_CONFIG['database']}")
                print(f"✅ Created database '{DB_CONFIG['database']}'")
            else:
                print(f"✅ Database '{DB_CONFIG['database']}' already exists")
        
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Failed to create database: {e}")
        return False

def test_database_connection():
    """Test connection to the kkevo database"""
    try:
        conn = psycopg.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            dbname=DB_CONFIG['database']
        )
        print(f"✅ Successfully connected to database '{DB_CONFIG['database']}'")
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Failed to connect to database '{DB_CONFIG['database']}': {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up PostgreSQL database for KKEVO...")
    print(f"📊 Database: {DB_CONFIG['database']}")
    print(f"👤 User: {DB_CONFIG['user']}")
    print(f"🔑 Password: {DB_CONFIG['password']}")
    print(f"🌐 Host: {DB_CONFIG['host']}:{DB_CONFIG['port']}")
    print()
    
    # Test server connection
    if not test_connection():
        print("\n❌ Cannot proceed without PostgreSQL server connection")
        print("Please make sure PostgreSQL is running and accessible")
        return False
    
    # Create database
    if not create_database():
        print("\n❌ Failed to create database")
        return False
    
    # Test database connection
    if not test_database_connection():
        print("\n❌ Failed to connect to database")
        return False
    
    print("\n✅ PostgreSQL setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Run Django migrations: python manage.py migrate")
    print("2. Create superuser: python manage.py createsuperuser")
    print("3. Seed demo data: python manage.py seed_demo")
    print("4. Start the server: python manage.py runserver 8081")
    
    return True

if __name__ == "__main__":
    main()




