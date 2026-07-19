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
      quiz: [
        {
          question: 'When writing a professional email about a problem, what should you always include?',
          options: {
            a: 'Just the problem without offering solutions',
            b: 'The specific issue, its impact, and concrete next steps',
            c: 'Emotional language to express how frustrated you are',
            d: 'A list of all past problems with this person'
          },
          correct: 'b'
        },
        {
          question: 'What is active listening?',
          options: {
            a: 'Staying quiet while someone talks',
            b: 'Fully focusing on the speaker, asking clarifying questions, and reflecting back what you heard',
            c: 'Thinking about your response while they speak',
            d: 'Taking detailed notes without making eye contact'
          },
          correct: 'b'
        },
        {
          question: 'When giving constructive feedback, you should focus on:',
          options: {
            a: 'The person\'s character and personality',
            b: 'Specific behaviors and their impact, with suggestions for improvement',
            c: 'Criticism disguised as jokes',
            d: 'Only pointing out mistakes without solutions'
          },
          correct: 'b'
        }
      ]
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
      quiz: [
        {
          question: 'When two teammates disagree on project approach, what\'s the best first step?',
          options: {
            a: 'Go with your idea and ignore theirs',
            b: 'Ask each person why their approach matters to them and listen for underlying concerns',
            c: 'Let the loudest person decide',
            d: 'Avoid the conflict entirely'
          },
          correct: 'b'
        },
        {
          question: 'In a remote team setting, what\'s most important for collaboration?',
          options: {
            a: 'Only communicating through video calls',
            b: 'Clear documentation, regular check-ins, and respectful async communication',
            c: 'Working at the exact same time as everyone else',
            d: 'Assuming everyone works the same way you do'
          },
          correct: 'b'
        },
        {
          question: 'How should you handle a conflict with a teammate?',
          options: {
            a: 'Talk badly about them to other team members',
            b: 'Have a private conversation focused on solving the problem, not blaming',
            c: 'Ignore it and hope it goes away',
            d: 'Report them immediately without talking to them first'
          },
          correct: 'b'
        }
      ]
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
      quiz: [
        {
          question: 'Which task should you prioritize first?',
          options: {
            a: 'Urgent AND Important (deadline today, affects goals)',
            b: 'Important but NOT Urgent (builds future success)',
            c: 'Urgent but NOT Important (feels urgent but doesn\'t matter)',
            d: 'Neither urgent nor important (low-value busywork)'
          },
          correct: 'a'
        },
        {
          question: 'What is "deep work"?',
          options: {
            a: 'Working longer hours every day',
            b: 'Focused, distraction-free time on complex, important tasks',
            c: 'Multitasking to get more done',
            d: 'Responding to every message immediately'
          },
          correct: 'b'
        },
        {
          question: 'Early signs of burnout include:',
          options: {
            a: 'Feeling energized and excited',
            b: 'Chronic fatigue, loss of motivation, difficulty concentrating',
            c: 'Having clear work-life boundaries',
            d: 'Regular vacation time'
          },
          correct: 'b'
        }
      ]
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
      quiz: [
        {
          question: 'A course has 40% dropout. "Students aren\'t motivated" is a:',
          options: {
            a: 'Root cause (the real problem)',
            b: 'Symptom (surface observation, not the real cause)',
            c: 'Solution',
            d: 'Not relevant to the problem'
          },
          correct: 'b'
        },
        {
          question: 'The best way to find root cause is to:',
          options: {
            a: 'Assume the first explanation is correct',
            b: 'Ask "Why?" repeatedly to dig deeper: Why did it happen? Why did that happen?',
            c: 'Treat the symptom and hope it fixes the problem',
            d: 'Ignore the problem and move on'
          },
          correct: 'b'
        },
        {
          question: 'When making decisions under uncertainty, you should:',
          options: {
            a: 'Guess and hope for the best',
            b: 'Gather available information, consider options, and accept some risk',
            c: 'Wait until you have perfect information (which never comes)',
            d: 'Let others decide for you'
          },
          correct: 'b'
        }
      ]
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
      quiz: [
        {
          question: 'A growth mindset means believing:',
          options: {
            a: 'Your abilities are fixed and can\'t change',
            b: 'You can develop new skills and abilities through effort and learning',
            c: 'Failure defines who you are permanently',
            d: 'Challenges are threats to avoid'
          },
          correct: 'b'
        },
        {
          question: 'When you fail at something, the most productive response is:',
          options: {
            a: 'Give up because you\'re not good enough',
            b: 'Blame others for the failure',
            c: 'Analyze what went wrong, extract lessons, and try again differently',
            d: 'Pretend it never happened'
          },
          correct: 'c'
        },
        {
          question: 'How should you respond to unexpected change in your work?',
          options: {
            a: 'Resist it and hope things go back to normal',
            b: 'See it as an opportunity to learn new skills and adapt your approach',
            c: 'Panic and freeze',
            d: 'Blame the organization for the change'
          },
          correct: 'b'
        }
      ]
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
      quiz: [
        {
          question: 'Your professional brand should include:',
          options: {
            a: 'Only your job title and company',
            b: 'Your skills, values, unique perspective, and what you care about',
            c: 'Exaggerations about your achievements',
            d: 'Only technical skills, nothing personal'
          },
          correct: 'b'
        },
        {
          question: 'When networking or interviewing, you should:',
          options: {
            a: 'Tell a generic story that applies to everyone',
            b: 'Share a specific story that shows your skills and values authentically',
            c: 'Never mention personal experiences',
            d: 'Pretend to be someone you\'re not'
          },
          correct: 'b'
        },
        {
          question: 'Your LinkedIn profile should:',
          options: {
            a: 'Be outdated and rarely updated',
            b: 'Reflect your professional identity, accomplishments, and what you\'re working toward',
            c: 'Copy someone else\'s profile exactly',
            d: 'Only list job titles without context'
          },
          correct: 'b'
        }
      ]
    }
  ];

  const user = JSON.parse(localStorage.getItem('wh_currentUser') || 'null');
  if (!user) return;

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

      let quizHTML = `
        <div class="module__quiz">
          <strong>Quiz: ${module.title}</strong>
      `;

      module.quiz.forEach((q, idx) => {
        quizHTML += `
          <div class="module__question">
            <p class="module__question-text"><strong>Q${idx + 1}:</strong> ${q.question}</p>
            <div class="module__options">
        `;
        Object.entries(q.options).forEach(([key, text]) => {
          quizHTML += `
            <label class="module__option">
              <input type="radio" name="q_${module.id}_${idx}" value="${key}" data-module="${module.id}" data-question="${idx}">
              <span><strong>${key.toUpperCase()}.</strong> ${text}</span>
            </label>
          `;
        });
        quizHTML += `
            </div>
          </div>
        `;
      });

      quizHTML += `
          <button class="module__submit-btn" data-module-id="${module.id}">Submit Quiz</button>
          <div class="module__quiz-result" data-module-id="${module.id}"></div>
        </div>
      `;

      div.innerHTML = `
        <div class="module__header">
          <label class="module__check">
            <input type="checkbox" ${isComplete ? 'checked' : ''} data-module-id="${module.id}" disabled>
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
          ${quizHTML}
        </div>
      `;

      const submitBtn = div.querySelector('.module__submit-btn');
      const resultDiv = div.querySelector('.module__quiz-result');
      const checkbox = div.querySelector('input[type="checkbox"]');

      submitBtn.addEventListener('click', function() {
        const answers = {};
        module.quiz.forEach((q, idx) => {
          const selected = div.querySelector(`input[name="q_${module.id}_${idx}"]:checked`);
          answers[idx] = selected ? selected.value : null;
        });

        const unanswered = Object.values(answers).some(a => a === null);
        if (unanswered) {
          resultDiv.innerHTML = '<div class="module__quiz-fail">Please answer all questions before submitting.</div>';
          return;
        }

        let correct = 0;
        module.quiz.forEach((q, idx) => {
          if (answers[idx] === q.correct) correct++;
        });

        const percentage = (correct / module.quiz.length) * 100;
        const passed = percentage >= 80;

        if (passed) {
          resultDiv.innerHTML = `<div class="module__quiz-pass">✓ Passed! You got ${correct}/${module.quiz.length} correct. Well done!</div>`;
          checkbox.checked = true;
          submitBtn.disabled = true;
          submitBtn.textContent = 'Completed ✓';

          const p = getCourseProgress();
          if (!p.completedModules.includes(module.id)) {
            p.completedModules.push(module.id);
          }
          saveCourseProgress(p);
          updateProgress();
          updateCertificate();
        } else {
          resultDiv.innerHTML = `<div class="module__quiz-fail">You got ${correct}/${module.quiz.length} correct. Need 80% to pass. Try again!</div>`;
        }
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
