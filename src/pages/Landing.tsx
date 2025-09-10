import { BookOpen, Library, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const Landing = () => {
  return <div className="min-h-screen bg-gradient-to-br from-background via-paper to-accent/30">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-leather rounded-xl flex items-center justify-center shadow-elegant">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-leather rounded-full flex items-center justify-center shadow-elegant">
            <Library className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight px-0 text-center">
            Your Personal Library,
            <span className="text-gradient bg-gradient-leather bg-clip-text text-transparent"></span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Manage your book collection, track lending, upload PDFs, and never lose track of your literary treasures again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild variant="leather" size="lg" className="text-lg px-8 py-6">
              <Link to="/library">
                <BookOpen className="w-5 h-5 mr-2" />
                Enter My Library
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/library">
                <Heart className="w-5 h-5 mr-2" />
                Explore Features
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-elegant">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Book Management</h3>
              <p className="text-muted-foreground text-sm">
                Add, edit, and organize your books with covers, descriptions, and PDF uploads.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-elegant">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Lending Tracker</h3>
              <p className="text-muted-foreground text-sm">
                Keep track of who borrowed your books and when they're due back.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-elegant">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Library className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Search</h3>
              <p className="text-muted-foreground text-sm">
                Find any book instantly by title, author, genre, or lending status.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-16 border-t border-border/50">
        <div className="text-center text-muted-foreground">
          <p>Your personal library companion</p>
        </div>
      </footer>
    </div>;
};
export default Landing;