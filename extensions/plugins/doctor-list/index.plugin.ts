/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Injectable } from '@nestjs/common';

import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import {
  OutgoingMessageFormat,
  StdOutgoingListEnvelope,
  StdOutgoingTextEnvelope,
} from '@/chat/schemas/types/message';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';

import { ButtonType, PostBackButton } from '@/chat/schemas/types/button';
import { ContentOptions } from '@/chat/schemas/types/options';
import { ContentTypeService } from '@/cms/services/content-type.service';
import { ContentService } from '@/cms/services/content.service';
import SETTINGS from './settings';

@Injectable()
export class HelloPlugin extends BaseBlockPlugin<typeof SETTINGS> {
  template: PluginBlockTemplate = {
    name: 'Doctor Plugin',
    patterns: ['doctor'],
  };

  constructor(
    pluginService: PluginService,
    private contentService: ContentService,
    private contentTypeService: ContentTypeService,
  ) {
    super('doctor-plugin', pluginService);
  }

  getPath(): string {
    return __dirname;
  }

  async process(block: Block, _context: Context, _convId: string) {
    console.log({ block });
    console.log({ _context });
    console.log({ _convId });
    const contentType = await this.contentTypeService.findOne({
      name: 'doctors',
    });
    


    const visited = _context.payload === 'seen before' ? "Yes" : "No";

    

    

    

    if (_context.payload === 'seen before') {
      const buttons: PostBackButton[] = [
        {
          type: ButtonType.postback,
          title: 'Select',
          payload: 'Hi',
        },
      ];
      const options: ContentOptions = {
        fields: {
          title: 'title',
          url: 'http://google.com',
          subtitle: 'bio',
          image_url: '',
          action_payload: 'title',
          action_title: 'title',
        },
        top_element_style: 'large',
        limit: 10,
        display: OutgoingMessageFormat.list,
        buttons: buttons,
        entity: contentType.id,
        query: {
          ['dynamicFields.visited' as any]: visited,
        },
      };

      Object.assign(block.options, { content: options });
      //

      const contentData = await this.contentService.getContent(options, 0);

      console.log({ contentData });
      console.log({ contentData });
      // debugger;

      const envelope: StdOutgoingListEnvelope = {
        format: OutgoingMessageFormat.carousel,
        message: {
          ...contentData,
          options: options,
        },
      };
      console.log('>>>>>>', JSON.stringify(envelope));
      return envelope;
    }

    if (_context.payload === 'new one') {
      const buttons: PostBackButton[] = [
        {
          type: ButtonType.postback,
          title: 'Select',
          payload: 'hi',
        },
      ];
      const options: ContentOptions = {
        fields: {
          title: 'title',
          url: 'http://google.com',
          subtitle: 'bio',
          image_url: '',
          action_payload: 'title',
          action_title: 'title',
        },
        top_element_style: 'large',
        limit: 10,
        display: OutgoingMessageFormat.list,
        buttons: buttons,
        entity: contentType.id,
        query: {
          ['dynamicFields.visited' as any]: 'No',
        },
      };

      Object.assign(block.options, { content: options });
      //

      const contentData = await this.contentService.getContent(options, 0);

      console.log({ contentData });
      console.log({ contentData });
      // debugger;

      const envelope: StdOutgoingListEnvelope = {
        format: OutgoingMessageFormat.carousel,
        message: {
          ...contentData,
          options: options,
        },
      };
      console.log('>>>>>>', JSON.stringify(envelope));
      return envelope;
    }

    const args = this.getArguments(block);
    console.log({ args });

    const envelope: StdOutgoingTextEnvelope = {
      format: OutgoingMessageFormat.text,
      message: {
        text: args.message,
      },
    };

    return envelope;
  }
}
