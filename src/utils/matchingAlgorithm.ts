export interface UserProfile {
  skills: string;
  work_style: string;
  free_time: number;
  reliability_score: number;
}

export interface ProjectData {
  tech_stack: string;
  roles_needed: string;
  description: string;
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  // Split by comma or space, convert to lowercase, remove symbols
  return text.toLowerCase()
    .replace(/[^\w\s,]/g, '')
    .split(/[\s,]+/)
    .filter(word => word.length > 2); // Ignore short words like "a", "an", "is"
}

export interface MatchResult {
  score: number;
  breakdown: {
    skills: number;
    vibe: number;
    availability: number;
    reliability: number;
  };
  explanation: string;
}

export function calculateMatchScore(profile: UserProfile | null, project: ProjectData): MatchResult {
  if (!profile) return {
    score: 0,
    breakdown: { skills: 0, vibe: 0, availability: 0, reliability: 0 },
    explanation: "Please update your profile so the AI can evaluate your compatibility."
  };

  const profileSkills = extractKeywords(profile.skills);
  const projectTech = extractKeywords(project.tech_stack);
  const projectRoles = extractKeywords(project.roles_needed);
  const targetKeywords = new Set([...projectTech, ...projectRoles]);
  
  let skillMatches: string[] = [];
  profileSkills.forEach(skill => {
    if (targetKeywords.has(skill)) skillMatches.push(skill);
  });

  let skillScore = 0;
  if (targetKeywords.size > 0) {
    skillScore = Math.min(100, (skillMatches.length / Math.min(3, targetKeywords.size)) * 100);
  } else {
    skillScore = 50;
  }

  const profileVibe = extractKeywords(profile.work_style);
  const projectDesc = extractKeywords(project.description);
  const descKeywords = new Set(projectDesc);
  let vibeMatches = 0;
  profileVibe.forEach(word => {
    if (descKeywords.has(word)) vibeMatches++;
  });

  let vibeScore = Math.min(100, (vibeMatches / 2) * 100);
  if (profileVibe.length === 0) vibeScore = 0;

  let timeScore = 0;
  if (profile.free_time >= 15) timeScore = 100;
  else if (profile.free_time >= 10) timeScore = 80;
  else if (profile.free_time >= 5) timeScore = 50;
  else timeScore = 20;

  const relScore = profile.reliability_score || 100;

  const totalScore = Math.round(
    (skillScore * 0.40) + 
    (vibeScore * 0.30) + 
    (timeScore * 0.10) + 
    (relScore * 0.20)
  );

  // Generate a simple AI explanation
  let explanation = "";
  if (skillMatches.length > 0) {
    explanation = `You have the skills (${skillMatches.slice(0, 2).join(", ")}) that this project is looking for. `;
  } else {
    explanation = "This project requires some skills that are new to you. ";
  }

  if (vibeScore > 70) {
    explanation += "Your work style aligns perfectly with the project's direction.";
  } else if (totalScore > 80) {
    explanation += "Your reliability and availability are major pluses!";
  }

  return {
    score: totalScore,
    breakdown: {
      skills: Math.round(skillScore),
      vibe: Math.round(vibeScore),
      availability: Math.round(timeScore),
      reliability: Math.round(relScore)
    },
    explanation: explanation
  };
}
