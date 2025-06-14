# Vessel Emissions Tracking System

Small Next.js app showing vessel emissions data.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)

## Overview

This app helps maritime companies track vessel emissions and compare them to Poseidon Principles baselines for climate compliance. It provides charts, deviation calculations, and emission analytics.

## Features

- Track multiple vessels and their specifications
- Daily emission logs with detailed metrics
- Poseidon Principles baseline calculation
- Deviation analysis (actual vs baseline)
- Highcharts-based emission visualization
- Compliance status indicators
- Multi-vessel comparison

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vessel-emissions
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set your database URL:
   Edit `.env.local`:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/vessel_emissions"
   ```

4. Set up the database:

   ```bash
   npx prisma generate
   npm run db:migrate
   npm run db:seed
   ```

5. Run the app:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
