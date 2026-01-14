import type { Schema, Struct } from '@strapi/strapi';

export interface CursosCardInscricao extends Struct.ComponentSchema {
  collectionName: 'components_cursos_card_inscricaos';
  info: {
    displayName: 'Card Inscricao';
  };
  attributes: {
    data_limite: Schema.Attribute.Date;
    link: Schema.Attribute.String;
    nome: Schema.Attribute.String;
  };
}

export interface CursosCardMaterial extends Struct.ComponentSchema {
  collectionName: 'components_cursos_card_materials';
  info: {
    displayName: 'Card Material';
  };
  attributes: {
    semana: Schema.Attribute.String;
    ttitulo: Schema.Attribute.String;
    url_documento: Schema.Attribute.String;
  };
}

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
      'cursos.card-inscricao': CursosCardInscricao;
      'cursos.card-material': CursosCardMaterial;
      'home-element.banner': HomeElementBanner;
      'home-element.card-curso': HomeElementCardCurso;
      'home-element.depoimentos': HomeElementDepoimentos;
      'home-element.link-menu': HomeElementLinkMenu;
    }
  }
}
