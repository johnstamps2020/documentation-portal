import { integer } from '@elastic/elasticsearch/api/types';

export type ApiResponse = {
  status: integer;
  body: any;
};
