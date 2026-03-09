export default function AboutComponent() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-md mt-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">About Helpful Money</h1>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">The Journey: From Bankruptcy to Budgeting</h2>
                <p className="mb-4 text-lg text-gray-700 leading-relaxed">
                    I wasn't taught about money growing up, other than a single quote my mum taught me:
                    <span className="italic block my-2 text-center">"Neither a borrower nor a lender be"</span>
                    It's a piece of advice famously given by Polonius in Shakespeare's <span className="italic">Hamlet</span>.
                    For my mum, it was a rule to live by, but for me, it wasn't quite enough to navigate the modern world.
                    When I was introduced to credit cards, things went badly wrong.
                </p>
                <p className="mb-4 text-lg text-gray-700 leading-relaxed">
                    I eventually faced a major life change—bankruptcy and divorce—to fix the mess. That "midlife hiccup"
                    was a wake-up call. Since then, budgeting has been the cornerstone of my life. It's the tool that
                    gave me back control.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Why I Built This Site</h2>
                <p className="mb-4 text-lg text-gray-700 leading-relaxed">
                    I want to retire comfortably, and given my history, I know I have to do it right. I'm certain I'm not
                    alone in that goal. I built Helpful Money to share the tools and principles I use to navigate my
                    own financial recovery and growth.
                </p>
                <p className="mb-4 text-lg text-gray-700 leading-relaxed">
                    While this site also serves as a demonstration of my skills as a software developer, its primary
                    purpose is to provide genuine, practical value to anyone who wants to take their financial
                    future seriously.
                </p>
            </section>

            <section className="mb-10 text-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">A Different Philosophy</h2>
                <p className="mb-4 text-lg leading-relaxed">
                    My dad tried every "get rich quick" scheme under the sun. They didn't work. I've chosen a different
                    path—one built on ancient principles like compounding interest and careful, disciplined investing.
                </p>
                <p className="mb-4 text-lg leading-relaxed font-medium italic">
                    "Start thy purse to fattening."
                </p>
                <p className="mb-4 text-lg leading-relaxed">
                    The lessons from <a href="/babylon/" className="italic text-blue-600 hover:underline">The Babylon Series</a> aren't just old stories;
                    they are fundamental truths. I believe in the power of ancient wisdom made actionable through
                    modern technology. For those just starting, the <a href="/babylon/" className="font-semibold text-blue-600 hover:underline">7 Cures for a Lean Purse</a> is my recommended starting point.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Why I Build My Own Tools</h2>
                <p className="mb-4 text-lg text-gray-700 leading-relaxed">
                    As a software developer and, admittedly, a bit of a control freak, I wanted to understand exactly
                    how these financial calculations worked. Building the tools myself allowed me to deepen my own
                    understanding of the math behind mortgages, pensions, and budgets.
                </p>
                <p className="mb-4 text-lg text-gray-700 leading-relaxed">
                    By building them from scratch, I can ensure they stay simple, transparent, and focused on what
                    actually matters: helping you make better decisions.
                </p>
            </section>

            <div className="text-center mt-12 pt-8 border-t border-gray-100">
                <p className="text-gray-600 italic">
                    Authenticity builds trust. This is my journey, and these are my tools. I hope they help you on yours.
                </p>
            </div>
        </div>
    );
}