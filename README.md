# FACEIT Match Insights

Faceit Insights is a powerful analytics dashboard for Counter-Strike 2 matches played on the FACEIT platform. Built with Next.js and TypeScript, it transforms raw match data into actionable visual insights, helping players and teams understand their performance beyond the basic scoreboard.

## 🚀 Features

- **Impact Matrix**: Go beyond K/D. Visualize player impact versus survival with colored quadrants to identify the true MVPs of the match.
- **Entry Analysis**: Analyze opening duel attempts versus success rates to see who is creating space for the team.
- **Team Comparison**: A "Tale of the Tape" side-by-side comparison of total Kills, Assists, Utility Damage, and other key metrics.
- **Level vs Performance**: Analyze if higher FACEIT levels (Elo) actually translate to better in-game performance.
- **Player Badges**: Fun and informative titles like "The Juggernaut", "The Immortal", or "The Tactician" assigned based on unique playstyles.
- **Advanced Stats**: Deep dive into Utility usage, Flash assists, Clutch success rates, and Multikills.
- **Search Functionality**: Easily analyze matches by pasting a FACEIT match room URL or Match ID.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Charts & Visualization**: [Chart.js](https://www.chartjs.org/), [React Chartjs 2](https://react-chartjs-2.js.org/)
- **Data Source**: [FACEIT Data API v4](https://developers.faceit.com/docs/tools/data-api)

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, pnpm, or bun
- A FACEIT Developer API Key (You can get one [here](https://developers.faceit.com/))

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/faceit-insights.git
    cd faceit-insights
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env.local` file in the root directory and add your FACEIT API key:

    ```env
    FACEIT_API_KEY=your_faceit_api_key_here
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  **Open the application:**

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 Usage

1.  **Find a Match**: Go to [FACEIT.com](https://www.faceit.com/) and copy the URL of a finished CS2 match room (e.g., `https://www.faceit.com/en/cs2/room/1-1234...`).
2.  **Analyze**: Paste the URL or the Match ID into the search bar on the home page and click "Analyze".
3.  **Explore**: View detailed analytics, charts, and player breakdowns on the match details page.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
