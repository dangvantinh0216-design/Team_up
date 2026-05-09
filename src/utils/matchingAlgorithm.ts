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

export function calculateMatchScore(profile: UserProfile | null, project: ProjectData): number {
  if (!profile) return 0; // If user has no profile, score is 0

  let totalScore = 0;

  // 1. Skill Match (40% of total score)
  const profileSkills = extractKeywords(profile.skills);
  const projectTech = extractKeywords(project.tech_stack);
  const projectRoles = extractKeywords(project.roles_needed);
  
  const targetKeywords = new Set([...projectTech, ...projectRoles]);
  let skillMatches = 0;
  
  profileSkills.forEach(skill => {
    if (targetKeywords.has(skill)) skillMatches++;
  });

  // Calculate skill score: If project has requirements, max 3 matches = 100% of this section
  let skillScore = 0;
  if (targetKeywords.size > 0) {
    skillScore = Math.min(100, (skillMatches / Math.min(3, targetKeywords.size)) * 100);
  } else {
    skillScore = 50; // Neutral if no tech specified
  }
  totalScore += skillScore * 0.40;

  // 2. Vibe Match (30% of total score)
  const profileVibe = extractKeywords(profile.work_style);
  const projectDesc = extractKeywords(project.description);
  
  const descKeywords = new Set(projectDesc);
  let vibeMatches = 0;
  
  profileVibe.forEach(word => {
    if (descKeywords.has(word)) vibeMatches++;
  });

  // Calculate vibe score: 2 overlapping words give full 100% of this section
  let vibeScore = Math.min(100, (vibeMatches / 2) * 100);
  if (profileVibe.length === 0) vibeScore = 0;
  totalScore += vibeScore * 0.30;

  // 3. Availability (10% of total score)
  let timeScore = 0;
  if (profile.free_time >= 15) timeScore = 100;
  else if (profile.free_time >= 10) timeScore = 80;
  else if (profile.free_time >= 5) timeScore = 50;
  else timeScore = 20;
  totalScore += timeScore * 0.10;

  // 4. Reliability Score (20% of total score)
  const relScore = profile.reliability_score || 100; // Default is 100
  totalScore += relScore * 0.20;

  return Math.round(totalScore);
}
