# KCET 2025 Mock Planner - Choice Vision

A comprehensive web application for KCET 2025 aspirants to plan their college preferences, analyze admission chances, and access premium resources.

## Features

- **Option Entry**: Add and manage your college preferences with drag-and-drop reordering
- **Real-time Analytics**: Analyze your admission chances based on historical cutoff data (Premium Feature - ₹5)
- **Smart Recommendations**: Get personalized college recommendations based on your rank (Premium Feature - ₹5)
- **PDF Export**: Export your option list as a professional PDF (Premium Feature - ₹5)
- **Community Resources**: Access 25+ college communities and expert guides
- **Mobile Responsive**: Works perfectly on all devices

## Payment System

The app includes a **one-time payment system** for premium features with **unlimited access**:

### PDF Export (₹5)
- Professional PDF format with your complete option list
- Analytics summary and college details
- Ready for printing and offline reference
- **Unlimited downloads** - pay once, download as many times as you want

### Analytics & Recommendations (₹5)
- Advanced analytics dashboard with real-time probability analysis
- Smart college recommendations based on your rank
- Historical data insights and trend analysis
- **Unlimited access** - pay once, use analytics unlimited times

### Payment Integration
- **Secure payments** powered by Razorpay
- Multiple payment options: UPI, cards, net banking
- **No recurring charges** - one-time payment only
- **Lifetime access** - pay once, use forever
- **Demo mode** available for testing

### How to Set Up Payments
1. Sign up for a Razorpay account
2. Get your test/live API keys
3. Replace `rzp_test_YOUR_KEY_HERE` in `src/components/PaymentModal.tsx`
4. Set up a backend API for order creation (optional)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/choice-vision-kcet-main.git
   cd choice-vision-kcet-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **PDF Generation**: jsPDF, jspdf-autotable
- **Payments**: Razorpay
- **Deployment**: Vercel (recommended)

## Data Sources

- **Real cutoff data** from multiple KCET rounds
- **College information** from official sources
- **Community resources** from verified subreddits and forums

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]
- Visit: [your-website.com]

---

**Note**: This is a mock planner for educational purposes. Always cross-check with official KEA sources before making final decisions.
