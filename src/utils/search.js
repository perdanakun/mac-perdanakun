const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

export function searchPortfolio(query, projects, apps) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const entries = [
    ...projects.map(project => ({ id: `project-${project.id}`, title: project.title, subtitle: project.category,
      icon: project.thumbnail, project, type: 'project', search: [project.title, project.category, project.description, ...project.tools].join(' ') })),
    ...apps.map(app => ({ id: `app-${app.id}`, title: app.label, subtitle: '', icon: app.icon || app.fallbackIcon,
      app, type: 'app', search: app.label })),
  ];
  return entries.filter(entry => terms.every(term => normalize(entry.search).includes(term))).slice(0, 12);
}
