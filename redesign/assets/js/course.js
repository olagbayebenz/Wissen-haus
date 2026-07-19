(function() {
  'use strict';

  const modules = [
    {
      id: 1,
      title: 'Communication Skills',
      objectives: [
        'Communicate clearly in writing and verbally',
        'Practice active listening and ask clarifying questions',
        'Give and receive constructive feedback professionally'
      ],
      summary: 'Master the art of clear, empathetic communication—the foundation of all workplace relationships. Learn to express ideas concisely, listen actively, and handle difficult conversations with grace.',
      exercise: {
        title: 'Email Rewrite Challenge',
        scenario: 'Your colleague sent this email: "Hey, the project stuff isn\'t done yet and we have problems with the deadline thing. Let me know asap."',
        task: 'Rewrite this email to be clear, professional, and respectful. Focus on: specific issue, impact, and concrete next steps.',
        hint: 'A good email answers: What\'s the problem? Why does it matter? What do you need from the reader?'
      },
      reflection: 'Think of a recent miscommunication at work or in your learning space. How could clearer communication have prevented it?'
    },
    {
      id: 2,
      title: 'Teamwork & Collaboration',
      objectives: [
        'Contribute effectively to team goals',
        'Work respectfully across differences of opinion and background',
        'Navigate conflict and find win-win solutions'
      ],
      summary: 'Great teams aren\'t built on talent alone—they\'re built on trust, respect, and shared purpose. Learn to collaborate across differences, support your teammates, and resolve conflicts constructively.',
      exercise: {
        title: 'Conflict Resolution Scenario',
        scenario: 'Two teammates disagree on project approach. Alex wants a quick solution in 2 weeks. Jordan wants to do it thoroughly in 6 weeks. Both are right in their own way.',
        task: 'Write out how you\'d facilitate this conversation as a mediator. What questions would you ask? How would you find middle ground?',
        hint: 'Look for underlying concerns (speed, quality, resources, risk) rather than just positions. Can you reframe the problem so both win?'
      },
      reflection: 'Describe a team project where collaboration went well. What specific behaviors made it successful?'
    },
    {
      id: 3,
      title: 'Time Management & Productivity',
      objectives: [
        'Prioritize tasks using a clear framework',
        'Protect deep work time and minimize distractions',
        'Recognize burnout signs and practice sustainable productivity'
      ],
      summary: 'Productivity isn\'t about doing more—it\'s about doing what matters most with intention. Learn proven prioritization methods, build focused work habits, and maintain balance to avoid burnout.',
      exercise: {
        title: 'Priority Matrix Exercise',
        scenario: 'You have 5 tasks: (1) urgent email from your boss, (2) important project due next week, (3) quick admin task, (4) learning new skill for growth, (5) help a colleague with their deadline.',
        task: 'Sort these into: Urgent+Important, Important-Not-Urgent, Urgent-Not-Important, Neither. Then decide: What gets done today? What gets scheduled later? What can be delegated?',
        hint: 'Urgent ≠ Important. Protect time for Important-Not-Urgent tasks—that\'s where growth happens.'
      },
      reflection: 'What\'s your biggest time management challenge right now? What\'s one small change you could make this week?'
    },
    {
      id: 4,
      title: 'Problem-Solving & Critical Thinking',
      objectives: [
        'Break complex problems into manageable parts',
        'Identify root causes, not just symptoms',
        'Make informed decisions when facing uncertainty'
      ],
      summary: 'Every professional faces unexpected challenges. Develop a structured approach to problem-solving that moves beyond surface-level fixes to real, lasting solutions.',
      exercise: {
        title: 'Root Cause Analysis',
        scenario: 'A course has a 40% dropout rate. Initial reaction: "Students aren\'t motivated." But dive deeper—what are the real causes?',
        task: 'Ask 5 "Why?" questions to move from surface symptom to root cause. Example: Why are they dropping out? → Heavy workload. Why? → No clear schedule. Why? → No onboarding. What\'s the real fix?',
        hint: 'Treating the symptom ("add motivation") fails. Fixing the root ("clear schedule from day one") works.'
      },
      reflection: 'Think of a problem you solved recently. Could a more structured approach have saved time or led to a better outcome?'
    },
    {
      id: 5,
      title: 'Adaptability & Growth Mindset',
      objectives: [
        'Embrace change as an opportunity to learn',
        'Extract lessons from failure without shame',
        'Stay resourceful when plans fall apart'
      ],
      summary: 'The only constant in modern work is change. Build mental resilience, adopt a growth mindset, and learn to see challenges as chances to develop new capabilities.',
      exercise: {
        title: 'Failure Debrief',
        scenario: 'You worked for 3 weeks on a project proposal. Your manager rejected it. Your first reaction: frustration. Now what?',
        task: 'Write a "failure debrief": What assumptions were wrong? What did you learn? What\'ll you do differently next time? How does this actually make you stronger?',
        hint: 'Reframe failure as feedback, not judgment. "I failed" → "I learned." Growth mindset is a choice you make in moments like this.'
      },
      reflection: 'Recall a time when you had to adapt quickly. How did you handle it? What did you learn about yourself?'
    },
    {
      id: 6,
      title: 'Professional Branding & Your Story',
      objectives: [
        'Craft a compelling personal narrative',
        'Build and maintain a professional online presence',
        'Present yourself authentically in interviews and networking'
      ],
      summary: 'Your brand is how the world knows you. Learn to tell your story clearly, build a professional presence that reflects your values, and position yourself for opportunities.',
      exercise: {
        title: 'Your 30-Second Story',
        scenario: 'You\'re at a networking event. Someone asks: "What do you do?" You have 30 seconds before they move on.',
        task: 'Craft your elevator pitch. It should answer: What are you skilled at? What do you care about? What\'s unique about your approach? Make it authentic, not robotic.',
        hint: 'Structure: "I [skill/role] because I\'m passionate about [impact]. Right now I\'m focused on [current goal]."'
      },
      reflection: 'How would someone who knows you describe your professional strengths? Does your LinkedIn profile and resume tell that story?'
    }
  ];

  const user = JSON.parse(localStorage.getItem('wh_currentUser') || 'null');
  if (!user) return; // auth.js already redirected, this is belt-and-braces

  const moduleListEl = document.getElementById('moduleList');
  const progressLabelEl = document.getElementById('progressLabel');
  const progressFillEl = document.getElementById('progressFill');
  const certificateSectionEl = document.getElementById('certificateSection');
  const certificateEl = document.getElementById('certificate');

  function getCourseProgress() {
    const allProgress = JSON.parse(localStorage.getItem('wh_courseProgress') || '{}');
    return allProgress[user.email] || { completedModules: [], certificateId: null, certificateIssuedAt: null };
  }

  function saveCourseProgress(progress) {
    const allProgress = JSON.parse(localStorage.getItem('wh_courseProgress') || '{}');
    allProgress[user.email] = progress;
    localStorage.setItem('wh_courseProgress', JSON.stringify(allProgress));
  }

  function renderModules() {
    const progress = getCourseProgress();
    moduleListEl.innerHTML = '';

    modules.forEach(module => {
      const isComplete = progress.completedModules.includes(module.id);
      const div = document.createElement('div');
      div.className = 'module' + (isComplete ? ' module--complete' : '');
      div.innerHTML = `
        <div class="module__header">
          <label class="module__check">
            <input type="checkbox" ${isComplete ? 'checked' : ''} data-module-id="${module.id}">
            <span class="module__check-box"></span>
          </label>
          <h3 class="module__title">${module.title}</h3>
        </div>
        <div class="module__body">
          <div class="module__objectives">
            <strong>Learning Objectives</strong>
            <ul>
              ${module.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
          </div>
          <p class="module__summary">${module.summary}</p>
          <div class="module__exercise">
            <strong>Practical Exercise: ${module.exercise.title}</strong>
            <div class="module__exercise-content">
              <p><strong>Scenario:</strong> ${module.exercise.scenario}</p>
              <p><strong>Your Task:</strong> ${module.exercise.task}</p>
              <p><strong>💡 Hint:</strong> ${module.exercise.hint}</p>
            </div>
          </div>
          <div class="module__reflection">
            <strong>Reflection Prompt:</strong> <em>"${module.reflection}"</em>
          </div>
        </div>
      `;

      const checkbox = div.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', function() {
        const moduleId = parseInt(this.dataset.moduleId);
        const p = getCourseProgress();

        if (this.checked) {
          if (!p.completedModules.includes(moduleId)) {
            p.completedModules.push(moduleId);
          }
        } else {
          p.completedModules = p.completedModules.filter(id => id !== moduleId);
          p.certificateId = null;
          p.certificateIssuedAt = null;
        }

        saveCourseProgress(p);
        renderModules();
        updateProgress();
        updateCertificate();
      });

      moduleListEl.appendChild(div);
    });
  }

  function updateProgress() {
    const progress = getCourseProgress();
    const completed = progress.completedModules.length;
    const total = modules.length;
    const percentage = (completed / total) * 100;

    progressLabelEl.textContent = `${completed} of ${total} modules complete`;
    progressFillEl.style.width = percentage + '%';
  }

  function generateCertificateId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `WH-SSC-${timestamp.slice(-8)}`;
  }

  function updateCertificate() {
    const progress = getCourseProgress();

    if (progress.completedModules.length === modules.length) {
      if (!progress.certificateId) {
        progress.certificateId = generateCertificateId();
        progress.certificateIssuedAt = new Date().toISOString();
        saveCourseProgress(progress);
      }

      const issuedDate = new Date(progress.certificateIssuedAt);
      const dateStr = issuedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      certificateEl.innerHTML = `
        <div style="text-align: center; padding: 48px 32px; border: 3px solid var(--green-800); border-radius: var(--radius-lg); background: linear-gradient(135deg, rgba(15, 45, 29, 0.03), rgba(200, 160, 80, 0.03))">
          <div style="color: var(--green-800); font-size: 2.4rem; font-weight: 900; margin-bottom: 8px">✓</div>
          <h2 style="color: var(--ink); font-family: var(--ff-display); font-size: 2rem; margin: 0 0 8px">Certificate of Completion</h2>
          <p style="color: var(--ink-60); margin: 0 0 24px; font-size: 1rem">This is to certify that</p>
          <h3 style="color: var(--green-800); font-size: 1.8rem; margin: 0 0 24px; font-family: var(--ff-display)">${user.name}</h3>
          <p style="color: var(--ink); margin: 0 0 16px; font-size: 1.1rem">has successfully completed the course</p>
          <h4 style="color: var(--ink); font-size: 1.4rem; margin: 0 0 24px">Soft Skills for the Modern Workplace</h4>
          <p style="color: var(--ink-60); margin: 0 0 32px">Issued on ${dateStr}</p>
          <div style="border-top: 2px solid var(--green-800); padding-top: 16px; margin: 32px 0; display: flex; justify-content: space-around; align-items: flex-end">
            <div>
              <div style="color: var(--green-800); font-weight: 900; font-size: 1.2rem">Wissen-Haus</div>
              <div style="color: var(--ink-60); font-size: 0.9rem">Youth Empowerment Foundation</div>
            </div>
            <div style="text-align: right">
              <div style="color: var(--ink-60); font-size: 0.85rem; margin-bottom: 8px">Certificate ID</div>
              <div style="color: var(--green-800); font-family: var(--ff-mono); font-weight: 600">${progress.certificateId}</div>
            </div>
          </div>
          <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap">
            <button onclick="window.linkedInShare()" style="padding: 12px 24px; background: #0A66C2; color: #fff; border: none; border-radius: var(--radius); cursor: pointer; font-weight: 600; font-size: 1rem">Add to LinkedIn</button>
            <button onclick="window.print()" style="padding: 12px 24px; background: var(--green-800); color: #fff; border: none; border-radius: var(--radius); cursor: pointer; font-weight: 600; font-size: 1rem">Print / Save as PDF</button>
          </div>
        </div>
      `;

      certificateSectionEl.hidden = false;
    } else {
      certificateSectionEl.hidden = true;
    }
  }

  function linkedInShare() {
    const url = encodeURIComponent(window.location.href);
    const certId = getCourseProgress().certificateId;
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Soft%20Skills%20for%20the%20Modern%20Workplace&organizationName=Wissen-Haus%20Youth%20Empowerment%20Foundation&issueYear=${new Date().getFullYear()}&issueMonth=${String(new Date().getMonth() + 1).padStart(2, '0')}&certUrl=${url}&certId=${certId}`;
    window.open(linkedInUrl, '_blank');
  }

  window.linkedInShare = linkedInShare;

  // Initial render
  renderModules();
  updateProgress();
  updateCertificate();
})();
