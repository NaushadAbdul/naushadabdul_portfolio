import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { Skills } from "@/components/skills";
import { Socials } from "@/components/socials";
import { Testimonials } from "@/components/testimonials";
import {
  getExperience,
  getFeaturedProjects,
  getFeaturedTestimonials,
  getServices,
  getSettings,
  getSkills,
} from "@/lib/data";

/** Rebuild at most every 5 minutes so admin edits appear without a deploy. */
export const revalidate = 300;

export default async function HomePage() {
  const [settings, services, projects, skills, experience, testimonials] = await Promise.all([
    getSettings(),
    getServices(),
    getFeaturedProjects(),
    getSkills(),
    getExperience(),
    getFeaturedTestimonials(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <About settings={settings} />
      <Skills skills={skills} />
      <Experience experience={experience} />
      <Services services={services} />
      <Projects projects={projects} />
      <Testimonials testimonials={testimonials} />
      <Contact settings={settings} />
      <Socials settings={settings} />
    </>
  );
}
