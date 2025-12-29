// src/app/shared/seo/seo.service.ts
import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export type SeoConfig = {
  title: string;
  description: string;
  canonical?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string; // website, article, profile...
    locale?: string; // es_MX
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
  };
  jsonLd?: Record<string, any> | null;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);
  private router = inject(Router);

  set(config: SeoConfig) {
    // Title
    this.title.setTitle(config.title);

    // Basic
    this.meta.updateTag({ name: 'description', content: config.description });

    // OpenGraph
    const ogTitle = config.og?.title ?? config.title;
    const ogDesc = config.og?.description ?? config.description;

    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDesc });
    this.meta.updateTag({ property: 'og:type', content: config.og?.type ?? 'website' });
    this.meta.updateTag({ property: 'og:locale', content: config.og?.locale ?? 'es_MX' });

    if (config.og?.image) {
      this.meta.updateTag({ property: 'og:image', content: config.og.image });
    }

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: config.twitter?.card ?? 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: ogTitle });
    this.meta.updateTag({ name: 'twitter:description', content: ogDesc });
    if (config.og?.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.og.image });
    }

    // Canonical (si no te lo dan, lo calculo)
    const canonical =
      config.canonical ??
      `${environment.siteUrl}${this.router.url === '/' ? '' : this.router.url}`;

    this.setCanonical(canonical);

    // JSON-LD
    this.setJsonLd(config.jsonLd ?? null);
  }

  private setCanonical(url: string) {
    let link: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(schema: Record<string, any> | null) {
    const id = 'jsonld-schema';
    const existing = this.doc.getElementById(id);
    if (existing) existing.remove();

    if (!schema) return;

    const script = this.doc.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }
}
