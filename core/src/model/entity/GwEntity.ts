export abstract class GwEntity {
  uuid: string = '';

  public: boolean = false;

  internal: boolean = true;

  earlyAccess: boolean = true;

  isInProduction: boolean = false;
}
