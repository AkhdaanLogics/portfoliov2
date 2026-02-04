import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";
import {
  StaggeredGrid,
  AnimatedSection,
  AnimatedLine,
} from "../components/gsap-animations";

const redis = Redis.fromEnv();

export const revalidate = 60;
export default async function ProjectsPage() {
  const views = (
    await redis.mget<number[]>(
      ...allProjects.map((p) => ["pageviews", "projects", p.slug].join(":")),
    )
  ).reduce(
    (acc, v, i) => {
      acc[allProjects[i].slug] = v ?? 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  const featured =
    allProjects.find((project) => project.featured && project.published) ??
    allProjects.find((project) => project.published) ??
    allProjects[0];

  const hotProjects = allProjects
    .filter((p) => p.hot && p.published && p.slug !== featured?.slug)
    .sort(
      (a, b) =>
        new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
    );

  const top2 = hotProjects[0];
  const top3 = hotProjects[1];

  const sorted = allProjects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slug !== featured?.slug &&
        project.slug !== top2?.slug &&
        project.slug !== top3?.slug,
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  const renderLargeProject = (project: any) => (
    <Card>
      <Link href={`/projects/${project.slug}`}>
        <article className="relative w-full h-full p-4 md:p-8 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-zinc-100">
              {project.date ? (
                <time dateTime={new Date(project.date).toISOString()}>
                  {Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(project.date))}
                </time>
              ) : (
                <span>SOON</span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Eye className="w-4 h-4" />{" "}
              {Intl.NumberFormat("en-US", {
                notation: "compact",
              }).format(views[project.slug] ?? 0)}
            </span>
          </div>

          <h2
            id={`${project.slug}-post`}
            className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
          >
            {project.title}
          </h2>
          <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 flex-grow">
            {project.description}
          </p>
          <div className="mt-8 pt-4 border-t border-zinc-800/50">
            <p className="text-zinc-200 group-hover:text-white">
              Read more{" "}
              <span
                className="transition-transform duration-300 group-hover:translate-x-1 inline-block"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </p>
          </div>
        </article>
      </Link>
    </Card>
  );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <AnimatedSection className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">
            Some of the projects are from work and some are on my own time.
          </p>
        </AnimatedSection>
        <AnimatedLine className="w-full h-px bg-zinc-800" />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          {featured ? (
            <AnimatedSection delay={0.2}>
              {renderLargeProject(featured)}
            </AnimatedSection>
          ) : null}

          <AnimatedSection
            delay={0.3}
            className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 "
          >
            {top2 ? renderLargeProject(top2) : null}
            {top3 ? (
              <Card>
                <Article project={top3} views={views[top3.slug] ?? 0} />
              </Card>
            ) : null}
          </AnimatedSection>
        </div>
        <AnimatedLine className="hidden w-full h-px md:block bg-zinc-800" />

        <StaggeredGrid className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
        </StaggeredGrid>
      </div>
    </div>
  );
}
