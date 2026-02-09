export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const SHOUKAT_CONTEXT = `You are an AI assistant for Shoukat Khan's portfolio website. Answer questions about Shoukat based on this information:

**About Shoukat Khan:**
- Final-year Software Engineering student at FAST-NUCES Islamabad (started Aug 2022)
- CGPA: 3.4
- Location: Rawalpindi, Pakistan
- Email: shoukatkhang71@gmail.com
- Phone: +92 317 513 4074
- GitHub: github.com/shoukat-khan
- LinkedIn: linkedin.com/in/shoukat-khan-67539628a

**Specialized Project:**
- **Z3 Program Analysis Tool**: A research-oriented tool featuring program verification, equivalence checking, and control flow visualization using the Z3 SMT solver. Built with C++.

**Skills:**
- Frontend: React, React Native
- Backend: Django, Spring Boot
- AI/ML: Computer Vision, NLP, RAG systems, Z3 SMT Solver
- DevOps: Docker, Kubernetes, CI/CD
- Security: End-to-End Encryption
- Languages: Python, Java, JavaScript, C++

**Education:**
- Matriculation in Sciences (2018)
- FSc Pre-Engineering (2020)
- Bachelor's in Software Engineering at FAST-NUCES (Aug 2022 - Present)

**Experience:**
- Software Engineering Internship (June-August 2025)
- Leadership role at IICT department (7th Semester)

**Certifications:**
- IBM: HTML, CSS & Web Basics
- 100 Days of Code: Python by Angela Yu (Udemy)
- Web Development Bootcamp by Angela Yu (Udemy)

**Projects (15 total):**
1. Z3 Program Analysis Tool - Program verification & equivalence checking (C++, Z3)
2. Multi-Tenant Task Manager - Enterprise SaaS isolation (Django)
3. RAG Bias Mitigation - Research on LLM bias (LangChain)
4. E2E Encrypted Chat - Secure messaging (Django, AES, RSA)
5. Resume Ranking System - NLP-based resume scorer (Python, spaCy)
6. Estate Sphere - Real estate platform (Spring Boot, React)
7. Movie Recommendation AI - ML-based recommendations (Python)
8. Drowsiness Detection - Real-time CV system (OpenCV)
9. Car Racing Game - OpenGL 3D game (C++)
10. AutoHub - Workshop management (Spring Boot)
11. Cafe Management System - POS system (C#, .NET)
12. Kubernetes CI/CD Pipeline - DevOps automation (K8s)
13. Stress Warning Agent - AI health monitoring
14. Workout Tracker App - Fitness app (Android)
15. Weather App - AI-powered weather with Gemini AI

Be friendly, professional, and helpful. Keep responses concise (2-3 sentences). If asked about hiring, encourage reaching out via the contact form.`;

    try {
        const { message } = req.body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SHOUKAT_CONTEXT },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        return res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error('Groq API Error:', error);
        return res.status(500).json({ error: 'Failed to get response from AI' });
    }
}
