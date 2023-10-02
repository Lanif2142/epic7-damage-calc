import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Hero, HeroElement } from '../models/hero';
import { DamageFormData } from '../models/forms';
import { Artifact } from '../models/artifact';
import { Target } from '../models/target';
import { heroes } from '../../assets/data/heroes';

import * as _ from 'lodash-es'
import { BehaviorSubject } from 'rxjs';
import { DamageService } from './damage.service';
import { artifacts } from 'src/assets/data/artifacts';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // TODO: make sure these all have correct initial values when queryparams are implemented
  damageInputValues: DamageFormData = new DamageFormData({});
  damageInputChanged: EventEmitter<void> = new EventEmitter();

  // TODO: update the defaults here when possible
  currentHeroID: string = 'arbiter_vildred'
  currentHero: Hero = heroes.arbiter_vildred;  // Default to abigail when more things are working
  currentArtifact: Artifact = artifacts.a_symbol_of_unity;
  currentTarget: Target = new Target(this.currentArtifact);
  
  heroConstants: Record<string, number> = {
    'beehooBurnMult': 1.3
  };
  
  // Used for the caster_has_buff field
  casterBuffs = [
    'atk-up', 'vigor', 'atk-up-great', 'crit-dmg-up', 'caster-defense-up', 'caster-speed-up',
    'caster-has-flame-alchemist', 'caster-has-multilayer-barrier', 'caster-invincible',
    'caster-perception', 'caster-enrage', 'caster-fury', 'caster-stealth'
  ];

  attackModifiers = [
    'decreasedAttack', 'increasedAttack', 'increasedAttackGreat', 'casterVigor'
  ]
  
  damageMultSets = [
    'rageSet', 'torrentSet'
  ]

  displayConstants = {
    'font-family': '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'
  };

  advantageousElementMap = {
    [HeroElement.fire]: HeroElement.earth,
    [HeroElement.ice]: HeroElement.fire,
    [HeroElement.earth]: HeroElement.ice,
    [HeroElement.dark]: HeroElement.light,
    [HeroElement.light]: HeroElement.dark,
  }

  constructor() {
    this.initialSetup();
  }

  async initialSetup() {
  }

  updateDamageInputValues(updates: Record<string, any>) {
    for (const [field, data] of Object.entries(updates)) {
      this.setProperty(this.damageInputValues, field as keyof DamageFormData, data);
    }
    this.damageInputChanged.emit();
  }

  updateSelectedHero(hero: string) {
    this.currentHero = heroes[hero];
  }

  molagoras(): Record<string, number> {
    const molagoras: Record<string, number> = {};

    for (let i = 1; i < 4; i++) {
      if (_.get(this.currentHero.skills, `s${i}`)) {
        molagoras[`s${i}`] = this.damageInputValues[`molagoras${i}` as keyof DamageFormData] as number;
      }
    }

    return molagoras;
  }

  advantageousElement(hero: Hero = this.currentHero) {
    return this.advantageousElementMap[hero.element];
  }

  // Helper function to update the value of a form input
  setProperty<T, K extends keyof T>(object: T, property: K, value: any) {
    object[property] = value; 
  }
}
