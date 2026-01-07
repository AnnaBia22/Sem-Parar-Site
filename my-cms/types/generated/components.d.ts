import type { Schema, Struct } from '@strapi/strapi';

export interface HomeElementBanner extends Struct.ComponentSchema {
  collectionName: 'components_home_element_banners';
  info: {
    displayName: 'Banner';
  };
  attributes: {
    imagem: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface HomeElementCardCurso extends Struct.ComponentSchema {
  collectionName: 'components_home_element_card_cursos';
  info: {
    displayName: 'CardCurso';
  };
  attributes: {
    icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    link_pag: Schema.Attribute.String;
    nome_curso: Schema.Attribute.String;
  };
}

export interface HomeElementDepoimentos extends Struct.ComponentSchema {
  collectionName: 'components_home_element_depoimentos';
  info: {
    displayName: 'Depoimentos';
  };
  attributes: {
    foto_aluna: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    nome_aluna: Schema.Attribute.String;
    texto_depoimento: Schema.Attribute.Text;
  };
}

export interface HomeElementLinkMenu extends Struct.ComponentSchema {
  collectionName: 'components_home_element_link_menus';
  info: {
    displayName: 'LinkMenu';
  };
  attributes: {
    texto: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home-element.banner': HomeElementBanner;
      'home-element.card-curso': HomeElementCardCurso;
      'home-element.depoimentos': HomeElementDepoimentos;
      'home-element.link-menu': HomeElementLinkMenu;
    }
  }
}
