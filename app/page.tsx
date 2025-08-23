import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        CI/CD Fixer Agent
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        AI-powered solution that automatically detects,
                        analyzes, and fixes CI/CD workflow failures
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href="/dashboard">View Dashboard</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/analytics">View Analytics</Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-blue-600">
                                29
                            </CardTitle>
                            <CardDescription>
                                Failures Processed
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-green-600">
                                20+
                            </CardTitle>
                            <CardDescription>
                                Repositories Monitored
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-purple-600">
                                85%
                            </CardTitle>
                            <CardDescription>Success Rate</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* How It Works */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">
                                Detect
                            </h3>
                            <p className="text-gray-600">
                                Automatically monitors GitHub workflows and
                                detects failures
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-xl font-semibold mb-2">
                                Analyze
                            </h3>
                            <p className="text-gray-600">
                                AI analyzes error logs and identifies root
                                causes
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🛠️</div>
                            <h3 className="text-xl font-semibold mb-2">Fix</h3>
                            <p className="text-gray-600">
                                Generates and proposes intelligent fixes for
                                approval
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500">
                    <p>
                        Powered by AI • Real-time Monitoring • Intelligent Fixes
                    </p>
                </div>
            </div>
        </div>
    );
}
