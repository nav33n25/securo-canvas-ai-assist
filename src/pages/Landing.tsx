
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Database, Eye, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secure/10 to-secure/30 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10 z-0" />

        <div className="container mx-auto px-4 pt-6">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-4 relative z-10">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-secure" />
              <span className="text-2xl font-bold">SecureCanvas</span>
            </div>

            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px]">
                        <div className="security-border rounded-md p-3">
                          <div className="flex items-start gap-2">
                            <Lock className="h-5 w-5 text-secure mt-0.5" />
                            <div>
                              <h3 className="font-medium">Security Documentation</h3>
                              <p className="text-sm text-muted-foreground">Comprehensive security documentation platform</p>
                            </div>
                          </div>
                        </div>
                        <div className="security-border rounded-md p-3">
                          <div className="flex items-start gap-2">
                            <Database className="h-5 w-5 text-secure mt-0.5" />
                            <div>
                              <h3 className="font-medium">Compliance Management</h3>
                              <p className="text-sm text-muted-foreground">Streamline your security compliance processes</p>
                            </div>
                          </div>
                        </div>
                        <div className="security-border rounded-md p-3">
                          <div className="flex items-start gap-2">
                            <Eye className="h-5 w-5 text-secure mt-0.5" />
                            <div>
                              <h3 className="font-medium">Threat Monitoring</h3>
                              <p className="text-sm text-muted-foreground">Real-time security monitoring and alerts</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="#features" className="px-4 py-2 hover:text-secure">Features</Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="#pricing" className="px-4 py-2 hover:text-secure">Pricing</Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="#testimonials" className="px-4 py-2 hover:text-secure">Testimonials</Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/auth?tab=signin">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="bg-secure hover:bg-secure-darker" size="sm">Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="py-20 md:py-32 relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-block rounded-full bg-secure/10 px-3 py-1 text-sm font-medium text-secure mb-4">
                Next-gen Security Documentation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Secure Your Business <span className="text-secure">Documentation</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                The all-in-one platform for creating, managing, and sharing security documentation. 
                Built for modern cybersecurity teams.
              </p>
              <div className="flex gap-4 pt-4">
                <Link to="/auth?tab=signup">
                  <Button className="bg-secure hover:bg-secure-darker" size="lg">
                    Start for free <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">Schedule demo</Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
              <div className="w-full max-w-md p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl">
                <AspectRatio ratio={16/10} className="bg-sidebar overflow-hidden rounded-lg">
                  <div className="p-4 bg-gradient-to-br from-secure/5 to-secure/20 h-full">
                    <div className="security-border rounded p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-secure" />
                        <span className="text-sm font-medium">Security Overview</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="security-border rounded p-2 text-center">
                        <div className="text-xs text-muted-foreground">Documents</div>
                        <div className="text-2xl font-bold">42</div>
                      </div>
                      <div className="security-border rounded p-2 text-center">
                        <div className="text-xs text-muted-foreground">Compliance</div>
                        <div className="text-2xl font-bold">98%</div>
                      </div>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Security Features</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our platform provides everything you need to create, manage, and share security documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="security-border rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="rounded-full bg-secure/10 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-secure" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Documentation</h3>
              <p className="text-muted-foreground">
                Leverage our AI assistant to create professional security documentation in minutes, not hours.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="security-border rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="rounded-full bg-secure/10 w-12 h-12 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-secure" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Collaboration</h3>
              <p className="text-muted-foreground">
                Work together with your team in real-time, with secure access controls and version history.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="security-border rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="rounded-full bg-secure/10 w-12 h-12 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-secure" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compliance Templates</h3>
              <p className="text-muted-foreground">
                Choose from our library of templates for SOC 2, ISO 27001, GDPR, HIPAA, and more.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="security-border rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="rounded-full bg-secure/10 w-12 h-12 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-secure" />
              </div>
              <h3 className="text-xl font-bold mb-2">Security Dashboard</h3>
              <p className="text-muted-foreground">
                Get a bird's-eye view of your security posture with our customizable dashboard.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="security-border rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="rounded-full bg-threat/10 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-threat" />
              </div>
              <h3 className="text-xl font-bold mb-2">Threat Modeling</h3>
              <p className="text-muted-foreground">
                Identify and mitigate potential threats to your systems with our intuitive threat modeling tools.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="security-border rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="rounded-full bg-safe/10 w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-safe" />
              </div>
              <h3 className="text-xl font-bold mb-2">Audit-Ready Reports</h3>
              <p className="text-muted-foreground">
                Generate audit-ready reports with a single click, saving hours of preparation time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold">Starter</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for small teams getting started with security documentation.
                </p>
              </div>
              <div className="bg-muted p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Up to 5 users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">10 document templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Basic AI assistance</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-secure hover:bg-secure-darker">Get Started</Button>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="border border-secure rounded-lg overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-secure text-white text-xs px-2 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">Professional</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  For growing teams that need more features and customization.
                </p>
              </div>
              <div className="bg-muted p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Up to 20 users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">All document templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Advanced AI assistance</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Compliance dashboards</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-secure hover:bg-secure-darker">Get Started</Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  For organizations with advanced security documentation needs.
                </p>
              </div>
              <div className="bg-muted p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Unlimited users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Custom templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Premium AI features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secure mr-2" />
                    <span className="text-sm">SSO & advanced security</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">Contact Sales</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-secure/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Trusted by Security Professionals</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              See what our customers have to say about SecureCanvas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secure/20 flex items-center justify-center text-secure font-bold text-xl mr-3">
                  JD
                </div>
                <div>
                  <h4 className="font-bold">Jane Doe</h4>
                  <p className="text-sm text-muted-foreground">CISO, TechCorp</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "SecureCanvas has revolutionized how we handle security documentation. The AI assistant saves us countless hours every week."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secure/20 flex items-center justify-center text-secure font-bold text-xl mr-3">
                  MS
                </div>
                <div>
                  <h4 className="font-bold">Mark Smith</h4>
                  <p className="text-sm text-muted-foreground">Security Lead, DataSafe</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The compliance templates alone have saved us weeks of work. Our audit preparation time has been reduced by 75%."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secure/20 flex items-center justify-center text-secure font-bold text-xl mr-3">
                  AJ
                </div>
                <div>
                  <h4 className="font-bold">Alice Johnson</h4>
                  <p className="text-sm text-muted-foreground">GRC Manager, FinSecure</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "SecureCanvas has become an essential part of our security program. The dashboards give us instant visibility into our compliance status."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-secure/20 to-secure/40 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to secure your documentation?</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Get started with SecureCanvas today and transform how your team handles security documentation.
              </p>
            </div>
            <div>
              <Link to="/auth?tab=signup">
                <Button size="lg" className="bg-secure hover:bg-secure-darker">
                  Start your free trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-secure" />
                <span className="text-xl font-bold">SecureCanvas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The modern platform for security documentation.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-secure">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">Security</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">Compliance</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-secure">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-secure">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">Security Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-secure">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 SecureCanvas. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-secure">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-secure">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-secure">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
