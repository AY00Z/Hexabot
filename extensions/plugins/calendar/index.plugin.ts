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
  StdOutgoingButtonsEnvelope,
} from '@/chat/schemas/types/message';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';

import { ButtonType } from '@/chat/schemas/types/button';
import { ContentTypeService } from '@/cms/services/content-type.service';
import { ContentService } from '@/cms/services/content.service';
import SETTINGS from './settings';

@Injectable()
export class HelloPlugin extends BaseBlockPlugin<typeof SETTINGS> {
  template: PluginBlockTemplate = {
    name: 'Calender Plugin',
    patterns: ['doctor'],
  };

  constructor(
    pluginService: PluginService,
    private contentService: ContentService,
    private contentTypeService: ContentTypeService,
  ) {
    super('Calender-plugin', pluginService);
  }

  getPath(): string {
    return __dirname;
  }

  async process(block: Block, _context: Context, _convId: string) {
    debugger;
    console.log({ block });
    console.log({ _context });
    console.log({ _convId });

    const contentType = await this.contentTypeService.findOne({
      name: 'doctors',
    });

    const DoctorsTypeId = contentType.id;
    const content = await this.contentService.findOne({
      entity: DoctorsTypeId,
      title: _context.text,
    });

    console.log('aaaaaaaaaaaaaaaaa', _context);

    console.log('>>>>>>', content);

    const envelope: StdOutgoingButtonsEnvelope = {
      format: OutgoingMessageFormat.buttons,
      message: {
        text: 'Here is The Link ',
        buttons: [
          {
            type: ButtonType.web_url,
            title: "Le't Go",
            url: content.dynamicFields.link,
          },
        ],
      },
    };

    return envelope;
  }
}

// const options: ContentOptions = {
//   fields: {
//     title: 'title',
//     url: 'http://google.com',
//     subtitle: 'bio',
//     image_url: '',
//     action_payload: 'title',
//     action_title: 'title',
//   },
//   top_element_style: 'large',
//   limit: 10,
//   display: OutgoingMessageFormat.list,
//   buttons: buttons,
//   entity: contentType.id,
//   query: {
//     ['dynamicFields.visited' as any]: 'Yes',
//   },
// };

// Object.assign(block.options, { content: options });

// const contentData = await this.contentService.getContent(options, 0);

// const buttons: PostBackButton[] = [
//   {
//     type: ButtonType.postback,
//     title: 'Go To Calender',
//     payload: "Hi",
//   },
// ];
