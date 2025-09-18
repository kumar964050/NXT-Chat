// lib
import { Link } from 'react-router-dom';
// components
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
// icons
import { FiMessageSquare, FiVideo, FiShield, FiUsers, FiZap, FiHeart } from 'react-icons/fi';
// hooks
import useAuth from '@/hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FiMessageSquare,
      title: 'Real-time Messaging',
      description: 'Instant messaging with real-time delivery and read receipts',
    },
    {
      icon: FiVideo,
      title: 'Voice & Video Calls',
      description: 'Crystal clear voice and video calling with friends and family',
    },
    {
      icon: FiShield,
      title: 'Secure & Private',
      description: 'End-to-end encryption ensures your conversations stay private',
    },
    {
      icon: FiUsers,
      title: 'Group Conversations',
      description: 'Create group chats and stay connected with multiple people',
    },
    {
      icon: FiZap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast performance with 99.9% uptime reliability',
    },
    {
      icon: FiHeart,
      title: 'User Friendly',
      description: 'Beautiful, intuitive interface designed for seamless communication',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg text-foreground">
      {/* SEO Meta Tags */}
      <header>
        <title>Nxt-Chat - Modern Messaging App for Seamless Communication</title>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-gradient-primary rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-elegant">
              <span className="text-4xl font-bold text-primary-foreground">N</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Welcome to Nxt-Chat
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
              Experience the future of communication with our modern, secure, and lightning-fast
              messaging platform. Connect with friends, family, and colleagues like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link to="/app/chat">
                  <Button
                    size="default"
                    className="bg-gradient-primary border-0 text-sm px-5 py-3 h-auto"
                  >
                    Continue to Chat
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth/register">
                    <Button
                      size="default"
                      className="bg-gradient-primary border-0 text-sm px-5 py-3 h-auto"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button size="lg" variant="outline" className="text-sm px-5 py-3 h-auto">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Nxt-Chat?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful features that make Nxt-Chat the perfect choice for modern
              communication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border shadow-chat hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users already enjoying seamless communication with Nxt-Chat. Create
              your account today and experience the difference.
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-primary border-0 text-sm px-5 py-3 h-auto"
                  >
                    Create Account
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline" className="text-sm px-5 py-3 h-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg mr-3 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-lg font-semibold">Nxt-Chat</span>
          </div>
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Nxt-Chat. Modern messaging for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
